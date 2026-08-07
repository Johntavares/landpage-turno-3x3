import { create } from 'zustand';
import type { Vacation, Holiday, Ad } from '../types';
import {
  getLocalVacations,
  saveLocalVacations,
  getLocalCustomHolidays,
  saveLocalCustomHolidays,
  fetchRemoteAds,
} from '../services/storage';
import { getNationalHolidays } from '../services/holidays';

interface AppState {
  vacations: Vacation[];
  customHolidays: Holiday[];
  allHolidays: Holiday[];
  ads: Ad[];
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  
  addVacation: (vacation: Omit<Vacation, 'id'>) => void;
  updateVacation: (id: string, updates: Partial<Vacation>) => void;
  deleteVacation: (id: string) => void;
  
  addCustomHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  deleteCustomHoliday: (id: string) => void;

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  loadAds: () => Promise<void>;
}

const currentYear = new Date().getFullYear();
const nationalHolidays = [
  ...getNationalHolidays(currentYear - 1),
  ...getNationalHolidays(currentYear),
  ...getNationalHolidays(currentYear + 1),
];

export const useAppStore = create<AppState>((set, get) => {
  const initialVacations = getLocalVacations();
  const initialCustomHolidays = getLocalCustomHolidays();
  
  const initialTheme = (localStorage.getItem('turno3x3_theme') as AppState['theme']) || 'dark';


  return {
    vacations: initialVacations,
    customHolidays: initialCustomHolidays,
    allHolidays: [...nationalHolidays, ...initialCustomHolidays],
    ads: [],
    notificationsEnabled: localStorage.getItem('turno3x3_notifications') !== 'false',
    theme: initialTheme,

    addVacation: (v) => {
      const newVacation: Vacation = {
        ...v,
        id: 'vac_' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...get().vacations, newVacation];
      saveLocalVacations(updated);
      set({ vacations: updated });
    },

    updateVacation: (id, updates) => {
      const updated = get().vacations.map((v) => (v.id === id ? { ...v, ...updates } : v));
      saveLocalVacations(updated);
      set({ vacations: updated });
    },

    deleteVacation: (id) => {
      const updated = get().vacations.filter((v) => v.id !== id);
      saveLocalVacations(updated);
      set({ vacations: updated });
    },

    addCustomHoliday: (h) => {
      const newHoliday: Holiday = {
        ...h,
        id: 'hol_' + Date.now(),
      };
      const updatedCustom = [...get().customHolidays, newHoliday];
      saveLocalCustomHolidays(updatedCustom);
      set({
        customHolidays: updatedCustom,
        allHolidays: [...nationalHolidays, ...updatedCustom],
      });
    },

    deleteCustomHoliday: (id) => {
      const updatedCustom = get().customHolidays.filter((h) => h.id !== id);
      saveLocalCustomHolidays(updatedCustom);
      set({
        customHolidays: updatedCustom,
        allHolidays: [...nationalHolidays, ...updatedCustom],
      });
    },

    setTheme: (theme) => {
      localStorage.setItem('turno3x3_theme', theme);
      set({ theme });
    },

    setNotificationsEnabled: (enabled) => {
      localStorage.setItem('turno3x3_notifications', String(enabled));
      set({ notificationsEnabled: enabled });
    },

    loadAds: async () => {
      const ads = await fetchRemoteAds();
      set({ ads });
    },
  };
});
