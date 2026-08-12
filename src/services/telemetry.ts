import { sql } from './storage';

export interface AccessLog {
  id?: string;
  userEmail: string;
  team: string;
  timestamp: string; // ISO String
  isOffline: boolean;
  platform: string;
}

const OFFLINE_LOGS_KEY = 'turno3x3_offline_access_logs';

/**
 * Registra um evento de acesso diário (funciona 100% offline e online)
 */
export async function trackAppAccess(email: string = 'anonimo@turno3x3.app', team: string = 'A'): Promise<void> {
  const isOnline = navigator.onLine;
  const platform = getPlatformInfo();
  const nowStr = new Date().toISOString();

  const logEvent: AccessLog = {
    userEmail: email,
    team,
    timestamp: nowStr,
    isOffline: !isOnline,
    platform,
  };

  if (isOnline) {
    // Tenta enviar diretamente para o banco de dados Neon
    try {
      await sendLogToDatabase(logEvent);
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
    INSERT INTO "AccessLog" (user_email, team, timestamp, is_offline, platform)
    VALUES (${log.userEmail}, ${log.team}, ${log.timestamp}, ${log.isOffline}, ${log.platform})
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
 * Busca estatísticas executivas para o Painel Administrativo
 */
export async function fetchAdminStats() {
  try {
    // 1. Total de usuários cadastrados
    const profiles = await sql`
      SELECT id, name, email, team, base_date as "baseDate", created_at as "createdAt"
      FROM "Profile"
      ORDER BY created_at DESC
    `;

    // 2. Registros de acessos agregados por data
    const accessLogs = await sql`
      SELECT id, user_email as "userEmail", team, timestamp, is_offline as "isOffline", platform
      FROM "AccessLog"
      ORDER BY timestamp DESC
      LIMIT 200
    `;

    return {
      profiles: profiles || [],
      accessLogs: accessLogs || [],
    };
  } catch (err) {
    console.warn('Erro ao carregar estatísticas do painel admin:', err);
    return {
      profiles: [],
      accessLogs: [],
    };
  }
}

// Ouve o evento de reconexão 'online' para disparar sincronização automática
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncPendingOfflineLogs();
  });
}
