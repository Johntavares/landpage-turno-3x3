import React, { useState, useEffect } from 'react';
import { MobileLayout } from './components/layout/MobileLayout';
import type { TabType } from './components/layout/BottomNav';
import { AuthView } from './pages/Auth/AuthView';
import { OnboardingModal } from './components/OnboardingModal';
import { useAuthStore } from './stores/authStore';
import { useAppStore } from './stores/appStore';
import { AdMobService } from './services/admob';
import { LandingPageView } from './pages/LandingPage/LandingPageView';
import { AdminView } from './pages/Admin/AdminView';
import { trackAppAccess } from './services/telemetry';

import { HomeView } from './pages/Home/HomeView';
import { CalendarView } from './pages/Calendar/CalendarView';
import { ProfileView } from './pages/Profile/ProfileView';
import { SettingsView } from './pages/Settings/SettingsView';

export const App: React.FC = () => {
  const { isAuthenticated, isOnboarded, user } = useAuthStore();
  const { theme } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showLandingPage, setShowLandingPage] = useState(() => {
    // Se aberto como PWA instalado (standalone) ou via ?mode=app ou #app, abre direto no App sem exibir a Landing Page!
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      window.location.search.includes('mode=app') ||
      window.location.hash === '#app';
    return !isPWA;
  });
  const [showAdmin, setShowAdmin] = useState(false);


  // Registrar acesso/telemetria no início (funciona online e offline).
  // O trackAppAccess já faz dedupe por dispositivo+email+dia, então é seguro
  // chamar quando o usuário entra ou faz login.
  useEffect(() => {
    if (!showLandingPage) {
      trackAppAccess(user?.email || 'anon', user?.team || 'A');
    }
  }, [showLandingPage, user]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    }
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated && isOnboarded) {
      AdMobService.showBottomBanner();
    } else {
      AdMobService.hideBanner();
    }
  }, [isAuthenticated, isOnboarded]);

  // Exibir Painel Administrativo se ativado
  if (showAdmin) {
    return (
      <div className="dark min-h-screen bg-slate-950 p-4 text-slate-100">
        <div className="max-w-6xl mx-auto">
          <AdminView onBack={() => setShowAdmin(false)} />
        </div>
      </div>
    );
  }

  // PASSO 0: Se o usuário ainda não entrou no app, exibe a Landing Page de Apresentação
  if (showLandingPage) {
    return <LandingPageView onEnterApp={() => setShowLandingPage(false)} />;
  }

  // PASSO 1: Se o usuário NÃO está autenticado, exibe a Tela de Login (Redireciona para o Admin se for login administrativo)
  if (!isAuthenticated) {
    return <AuthView onAdminLogin={() => setShowAdmin(true)} />;
  }

  // PASSO 2: Se o usuário criou a conta / fez login mas ainda NÃO configurou a escala, exibe a Tela de Onboarding
  if (!isOnboarded) {
    return <OnboardingModal />;
  }

  // PASSO 3: Usuário autenticado e com a escala configurada -> Acesso completo ao aplicativo
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'calendar':
        return <CalendarView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };


  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveView()}
    </MobileLayout>
  );
};

export default App;
