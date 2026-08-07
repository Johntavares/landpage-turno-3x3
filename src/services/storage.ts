import { neon } from '@neondatabase/serverless';
import type { UserProfile, Vacation, Ad, Holiday } from '../types';

// Conexão Serverless HTTP direta com o banco de dados Neon PostgreSQL (Projeto: wispy-recipe-17884701)
const NEON_URL =
  import.meta.env.VITE_NEON_DATABASE_URL ||
  'postgresql://neondb_owner:npg_tU3ovAi8TpwS@ep-fancy-breeze-acc3grwc-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

export const sql = neon(NEON_URL);

const STORAGE_KEYS = {
  PROFILE: 'turno3x3_profile',
  VACATIONS: 'turno3x3_vacations',
  CUSTOM_HOLIDAYS: 'turno3x3_custom_holidays',
  THEME: 'turno3x3_theme',
  NOTIFICATIONS: 'turno3x3_notifications',
  ADS: 'turno3x3_managed_ads',
};

// ==================== LOCAL STORAGE SERVICES (OFFLINE-FIRST) ====================

export function getLocalProfile(): UserProfile | null {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveLocalProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getLocalVacations(): Vacation[] {
  const data = localStorage.getItem(STORAGE_KEYS.VACATIONS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLocalVacations(vacations: Vacation[]): void {
  localStorage.setItem(STORAGE_KEYS.VACATIONS, JSON.stringify(vacations));
}

export function getLocalCustomHolidays(): Holiday[] {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_HOLIDAYS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLocalCustomHolidays(holidays: Holiday[]): void {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_HOLIDAYS, JSON.stringify(holidays));
}

export function getLocalAds(): Ad[] {
  const data = localStorage.getItem(STORAGE_KEYS.ADS);
  if (!data) return getFallbackAd();
  try {
    const parsed: Ad[] = JSON.parse(data);
    const hasDaiana = parsed.some((a) => a.id === 'daiana-timoteo-estetica');
    if (!hasDaiana) return getFallbackAd();
    return parsed.length > 0 ? parsed : getFallbackAd();
  } catch {
    return getFallbackAd();
  }
}


export function saveLocalAds(ads: Ad[]): void {
  localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
}

// ==================== NEON POSTGRESQL REMOTE SERVICES ====================

export async function fetchRemoteProfile(email: string): Promise<UserProfile | null> {
  try {
    const rows = await sql`
      SELECT id, name, email, team, base_date as "baseDate", theme, created_at as "createdAt"
      FROM "Profile"
      WHERE email = ${email}
      LIMIT 1
    `;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      team: r.team,
      baseDate: r.baseDate,
      theme: r.theme || 'system',
      createdAt: r.createdAt,
    };
  } catch (err) {
    console.warn('Neon DB offline or table pending push:', err);
    return null;
  }
}

export async function syncRemoteProfile(profile: UserProfile): Promise<boolean> {
  try {
    await sql`
      INSERT INTO "Profile" (id, name, email, team, base_date, theme, updated_at)
      VALUES (${profile.id}, ${profile.name}, ${profile.email}, ${profile.team}, ${profile.baseDate}, ${profile.theme}, NOW())
      ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name,
          team = EXCLUDED.team,
          base_date = EXCLUDED.base_date,
          theme = EXCLUDED.theme,
          updated_at = NOW();
    `;
    return true;
  } catch (err) {
    console.warn('Neon sync warning:', err);
    return false;
  }
}

export async function fetchRemoteVacations(userId: string): Promise<Vacation[]> {
  try {
    const rows = await sql`
      SELECT id, user_id as "userId", start_date as "startDate", end_date as "endDate", note, created_at as "createdAt"
      FROM "Vacation"
      WHERE user_id = ${userId}
    `;
    if (!rows) return [];
    return rows.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      startDate: r.startDate,
      endDate: r.endDate,
      note: r.note,
      createdAt: r.createdAt,
    }));
  } catch {
    return [];
  }
}

export async function fetchRemoteAds(): Promise<Ad[]> {
  try {
    const rows = await sql`
      SELECT id, title, image_url as "imageUrl", link, active, display_order as "displayOrder"
      FROM "Ad"
      WHERE active = true
      ORDER BY display_order ASC
    `;
    if (!rows || rows.length === 0) return getLocalAds();
    return rows.map((ad: any) => ({
      id: ad.id,
      title: ad.title,
      imageUrl: ad.imageUrl,
      link: ad.link,
      active: ad.active,
      displayOrder: ad.displayOrder,
      location: ad.location || 'HOME',
    }));
  } catch {
    return getLocalAds();
  }
}

export function saveManagedAd(ad: Ad): Ad[] {
  const currentAds = getLocalAds();
  const existingIdx = currentAds.findIndex((a) => a.id === ad.id);
  let updated: Ad[];

  if (existingIdx >= 0) {
    updated = currentAds.map((a) => (a.id === ad.id ? ad : a));
  } else {
    updated = [ad, ...currentAds];
  }

  saveLocalAds(updated);
  return updated;
}

export function deleteManagedAd(id: string): Ad[] {
  const currentAds = getLocalAds();
  const updated = currentAds.filter((a) => a.id !== id);
  saveLocalAds(updated);
  return updated;
}

export function toggleManagedAd(id: string): Ad[] {
  const currentAds = getLocalAds();
  const updated = currentAds.map((a) => (a.id === id ? { ...a, active: !a.active } : a));
  saveLocalAds(updated);
  return updated;
}

function getFallbackAd(): Ad[] {
  return [
    {
      id: 'daiana-timoteo-estetica',
      title: 'Daiana Timóteo - Estética Facial (Parauapebas - PA)',
      imageUrl: '/ads/daiana-timoteo.jpg',
      link: 'https://wa.me/5594988026574?text=Ol%C3%A1!%20Vi%20seu%20an%C3%BAncio%20no%20app%20Turno%203x3%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o.',
      active: true,
      displayOrder: 1,
      location: 'HOME',
    },
    {
      id: 'banner-profile-default',
      title: 'Seguro & Benefícios para Operadores',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      link: 'https://wa.me/5594988026574?text=Ol%C3%A1!%20Vi%20seu%20an%C3%BAncio%20no%20app%20Turno%203x3%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o.',
      active: true,
      displayOrder: 2,
      location: 'PROFILE',
    },
  ];
}



