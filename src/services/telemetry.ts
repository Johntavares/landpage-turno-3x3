import { sql } from './storage';

export interface AccessLog {
  id?: string;
  userEmail: string;
  team: string;
  timestamp: string; // ISO String
  isOffline: boolean;
  platform: string;
  deviceId: string;
}

export interface AdminStats {
  totalLogs: number;
  alcance: number;
  ativosHoje: number;
  ativos7d: number;
  ativos30d: number;
  usuariosCadastrados: number;
  anonimos: number;
  offline: number;
  porPlataforma: { platform: string; total: number }[];
}

const OFFLINE_LOGS_KEY = 'turno3x3_offline_access_logs';
const DEVICE_ID_KEY = 'turno3x3_device_id';
const DAILY_LOG_PREFIX = 'turno3x3_access_logged_';
const ANON_EMAIL = 'anon';
const LEGACY_ANON_EMAIL = 'visitante@turno3x3.app';

/**
 * Gera (e persiste) um ID de dispositivo estável.
 * Mesmo sem login, cada aparelho vira uma unidade de alcance única.
 */
function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id =
        (typeof crypto !== 'undefined' && crypto.randomUUID?.()
          ? crypto.randomUUID()
          : 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36));
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return 'unknown';
  }
}

// Data local (YYYY-MM-DD) para o guard de dedupe diário
function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function alreadyLoggedToday(deviceId: string, email: string): boolean {
  try {
    const key = `${DAILY_LOG_PREFIX}${localDateKey()}_${deviceId}_${email}`;
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function markLoggedToday(deviceId: string, email: string): void {
  try {
    const key = `${DAILY_LOG_PREFIX}${localDateKey()}_${deviceId}_${email}`;
    localStorage.setItem(key, '1');
  } catch {
    /* noop */
  }
}

/**
 * Registra um evento de acesso diário (funciona 100% offline e online)
 */
export async function trackAppAccess(email: string = ANON_EMAIL, team: string = 'A'): Promise<void> {
  const isOnline = navigator.onLine;
  const platform = getPlatformInfo();
  const deviceId = getOrCreateDeviceId();
  const nowStr = new Date().toISOString();

  const logEvent: AccessLog = {
    userEmail: email,
    team,
    timestamp: nowStr,
    isOffline: !isOnline,
    platform,
    deviceId,
  };

  // Evita inflar a contagem: no máximo 1 registro por dispositivo + email + dia
  if (alreadyLoggedToday(deviceId, email)) {
    return;
  }

  if (isOnline) {
    // Tenta enviar diretamente para o banco de dados Neon
    try {
      await sendLogToDatabase(logEvent);
      markLoggedToday(deviceId, email);
      // Aproveita para sincronizar qualquer acesso antigo que ficou pendente offline
      await syncPendingOfflineLogs();
    } catch {
      // Se falhar a conexão, salva na fila local offline
      queueOfflineLog(logEvent);
    }
  } else {
    // Modo 100% Offline: Guarda na fila local para enviar quando a internet voltar
    queueOfflineLog(logEvent);
  }
}

/**
 * Adiciona log à fila offline no LocalStorage
 */
function queueOfflineLog(log: AccessLog): void {
  try {
    const existing = getPendingOfflineLogs();
    existing.push(log);
    localStorage.setItem(OFFLINE_LOGS_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Erro ao salvar log offline:', err);
  }
}

/**
 * Recupera os acessos pendentes guardados offline
 */
function getPendingOfflineLogs(): AccessLog[] {
  try {
    const data = localStorage.getItem(OFFLINE_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Sincroniza a fila de acessos offline acumulados quando recupera a conexão
 */
export async function syncPendingOfflineLogs(): Promise<void> {
  const pending = getPendingOfflineLogs();
  if (pending.length === 0) return;

  const remainingLogs = [...pending];
  try {
    while (remainingLogs.length > 0) {
      const log = remainingLogs[0];
      await sendLogToDatabase({ ...log, isOffline: true });
      markLoggedToday(log.deviceId, log.userEmail);
      remainingLogs.shift();
    }
    localStorage.removeItem(OFFLINE_LOGS_KEY);
    console.log(`[Telemetry] Sincronizados ${pending.length} acessos offline salvos anteriormente.`);
  } catch (err) {
    if (remainingLogs.length < pending.length) {
      localStorage.setItem(OFFLINE_LOGS_KEY, JSON.stringify(remainingLogs));
    }
    console.warn('[Telemetry] Falha ao sincronizar acessos offline:', err);
  }
}

/**
 * Envia um registro de acesso para o banco PostgreSQL Neon
 */
async function sendLogToDatabase(log: AccessLog): Promise<void> {
  await sql`
    INSERT INTO "AccessLog" (user_email, team, timestamp, is_offline, platform, device_id)
    VALUES (${log.userEmail}, ${log.team}, ${log.timestamp}, ${log.isOffline}, ${log.platform}, ${log.deviceId})
  `;
}

/**
 * Detecta se o usuário está acessando via PWA, Web ou APK Android
 */
function getPlatformInfo(): string {
  const userAgent = navigator.userAgent || '';
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
  
  if (userAgent.includes('Android') && isStandalone) return 'Android (PWA)';
  if (userAgent.includes('Android')) return 'Android (Browser/APK)';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return isStandalone ? 'iOS (PWA)' : 'iOS (Safari)';
  return 'Web Desktop';
}

/**
 * Busca estatísticas executivas para o Painel Administrativo.
 * As contagens são agregadas diretamente no banco (sem LIMIT 200) e usam
 * o fuso America/Sao_Paulo para os filtros de "hoje" e janelas de atividade.
 */
export async function fetchAdminStats() {
  try {
    // 1. Total de usuários cadastrados (tabela Profile)
    const profiles = await sql`
      SELECT id, name, email, team, base_date as "baseDate", created_at as "createdAt"
      FROM "Profile"
      ORDER BY created_at DESC
    `;

    // 2. Métricas agregadas de acesso (alcance, ativos, cadastrados, anônimos)
    const stats = await sql`
      SELECT
        COUNT(*)                                                                   AS "totalLogs",
        COUNT(DISTINCT device_id)                                                  AS "alcance",
        COUNT(DISTINCT device_id) FILTER (
          WHERE timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo'
                >= date_trunc('day', now() AT TIME ZONE 'America/Sao_Paulo')
        )                                                                          AS "ativosHoje",
        COUNT(DISTINCT device_id) FILTER (
          WHERE timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo'
                >= now() AT TIME ZONE 'America/Sao_Paulo' - interval '7 days'
        )                                                                          AS "ativos7d",
        COUNT(DISTINCT device_id) FILTER (
          WHERE timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo'
                >= now() AT TIME ZONE 'America/Sao_Paulo' - interval '30 days'
        )                                                                          AS "ativos30d",
        COUNT(DISTINCT user_email) FILTER (
          WHERE user_email IS DISTINCT FROM ${ANON_EMAIL}
            AND user_email IS DISTINCT FROM ${LEGACY_ANON_EMAIL}
        )                                                                          AS "usuariosCadastrados",
        COUNT(DISTINCT device_id) FILTER (
          WHERE user_email = ${ANON_EMAIL} OR user_email = ${LEGACY_ANON_EMAIL}
        )                                                                          AS "anonimos",
        COUNT(*) FILTER (WHERE is_offline)                                         AS "offline"
      FROM "AccessLog"
    `;

    // 3. Distribuição de acessos por plataforma
    const porPlataforma = await sql`
      SELECT platform, COUNT(*) AS total
      FROM "AccessLog"
      GROUP BY platform
      ORDER BY total DESC
    `;

    // 4. Registros recentes para exibição na tabela (limitado a 200 linhas)
    const accessLogs = await sql`
      SELECT id, user_email as "userEmail", team, timestamp, is_offline as "isOffline", platform, device_id as "deviceId"
      FROM "AccessLog"
      ORDER BY timestamp DESC
      LIMIT 200
    `;

    const s = (stats && stats[0]) || {};
    const toNum = (v: unknown) => (v === null || v === undefined ? 0 : Number(v));

    return {
      profiles: profiles || [],
      accessLogs: accessLogs || [],
      stats: {
        totalLogs: toNum(s.totalLogs),
        alcance: toNum(s.alcance),
        ativosHoje: toNum(s.ativosHoje),
        ativos7d: toNum(s.ativos7d),
        ativos30d: toNum(s.ativos30d),
        usuariosCadastrados: toNum(s.usuariosCadastrados),
        anonimos: toNum(s.anonimos),
        offline: toNum(s.offline),
        porPlataforma: porPlataforma || [],
      } as AdminStats,
    };
  } catch (err) {
    console.warn('Erro ao carregar estatísticas do painel admin:', err);
    return {
      profiles: [],
      accessLogs: [],
      stats: {
        totalLogs: 0,
        alcance: 0,
        ativosHoje: 0,
        ativos7d: 0,
        ativos30d: 0,
        usuariosCadastrados: 0,
        anonimos: 0,
        offline: 0,
        porPlataforma: [],
      } as AdminStats,
    };
  }
}

// Ouve o evento de reconexão 'online' para disparar sincronização automática
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncPendingOfflineLogs();
  });
}
