import React from 'react';
import { Smartphone, Globe, Download, CheckCircle2, ChevronRight, Calendar, Clock, Shield } from 'lucide-react';

interface LandingPageViewProps {
  onEnterApp: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp }) => {
  const previews = [
    { title: 'Acesso Seguro', img: '/previews/login.jpg' },
    { title: 'Status em Tempo Real', img: '/previews/home.jpg' },
    { title: 'Calendário Inteligente', img: '/previews/calendar.jpg' },
    { title: 'Gestão de Perfil', img: '/previews/profile.jpg' },
    { title: 'Personalização', img: '/previews/settings.jpg' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header / Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/icons/logo.png" alt="Logo" className="h-10 w-10 rounded-xl shadow-sm" />
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Turno 3x3</span>
          </div>
          <button
            onClick={onEnterApp}
            className="hidden md:flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
          >
            Acessar Web <Globe className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 pt-16 pb-24 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Solução para Indústria & Mineração
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Sua escala <span className="text-blue-600 text-glow">3x3</span> sob controle.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
            O Turno 3x3 é a ferramenta definitiva para profissionais que buscam clareza no planejamento. Organize suas folgas, visualize escalas futuras e gerencie suas férias em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <a
              href="/turno3x3.apk"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 group"
            >
              <Download className="w-6 h-6 mr-3 group-hover:translate-y-0.5 transition-transform" />
              Baixar para Android
            </a>
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 bg-white text-slate-900 border-2 border-slate-200 font-black rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
            >
              <Smartphone className="w-6 h-6 mr-3 text-slate-400" />
              Usar Versão Web (PWA)
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-slate-400">
            <div className="flex items-center gap-2 text-sm font-bold italic">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Gratuito
            </div>
            <div className="flex items-center gap-2 text-sm font-bold italic">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Offline-First
            </div>
            <div className="flex items-center gap-2 text-sm font-bold italic">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Sem Anúncios Invasivos
            </div>
          </div>
        </div>

        <div className="flex-1 w-full relative max-w-lg">
          <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-full"></div>
          <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-[8px] border-slate-800 aspect-[9/19] overflow-hidden group">
            <img
              src="/previews/home.jpg"
              alt="App Preview"
              className="h-full w-full object-cover rounded-[2rem] group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </header>

      {/* App Previews Gallery */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Experiência Simples e Intuitiva</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Desenvolvido pensando na rotina pesada do campo. Interface limpa com as informações que você precisa.</p>
          </div>

          <div className="flex overflow-x-auto pb-12 gap-6 snap-x no-scrollbar">
            {previews.map((item, idx) => (
              <div key={idx} className="flex-none w-64 snap-center space-y-4">
                <div className="bg-slate-100 rounded-3xl p-2 border border-slate-200 shadow-sm aspect-[9/19] overflow-hidden">
                  <img src={item.img} alt={item.title} className="h-full w-full object-cover rounded-2xl" />
                </div>
                <p className="text-center font-bold text-sm text-slate-700">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black">Escalas Futuras</h3>
          <p className="text-slate-500 leading-relaxed font-medium">Saiba onde você estará no Natal, Carnaval ou no aniversário dos filhos com meses de antecedência.</p>
        </div>
        <div className="space-y-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black">Controle de Trocas</h3>
          <p className="text-slate-500 leading-relaxed font-medium">Visualize exatamente o dia e horário da sua próxima troca entre os turnos de Dia e Noite.</p>
        </div>
        <div className="space-y-4">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black">Privacidade Total</h3>
          <p className="text-slate-500 leading-relaxed font-medium">Seus dados são sincronizados com segurança e pertencem apenas a você. Sem compartilhamento com terceiros.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm">3x3</div>
               <span className="text-lg font-black uppercase tracking-tighter">Turno 3x3</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Gestão inteligente para escalas de revezamento.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-slate-300">
            <a href="/app-ads.txt" className="hover:text-blue-400 transition-colors">AdMob Ads.txt</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Termos</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Suporte</a>
          </div>

          <p className="text-slate-500 text-xs font-medium">© 2026 Turno 3x3. Feito para profissionais.</p>
        </div>
      </footer>
    </div>
  );
};
