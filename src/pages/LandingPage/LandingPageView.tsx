import React, { useState } from 'react';
import { Smartphone, CheckCircle2, Calendar, Clock, Sparkles, Share, PlusSquare, ArrowRight, X, ExternalLink, Info } from 'lucide-react';

interface LandingPageViewProps {
  onEnterApp: () => void;
}

const GooglePlayIcon = () => (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.609-1.658V3.472c0-.641.226-1.23.608-1.658z" />
    <path fill="#FBBC04" d="M17.472 8.32l-3.68 3.68 3.68 3.68 4.225-2.455c.983-.57.983-2.335 0-2.905L17.472 8.32z" />
    <path fill="#4285F4" d="M3.609 1.814l10.183 10.186L17.472 8.32 6.136 1.722A2.43 2.43 0 0 0 3.609 1.814z" />
    <path fill="#34A853" d="M3.609 22.186A2.43 2.43 0 0 0 6.136 22.278l11.336-6.598-3.68-3.68L3.609 22.186z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-6 fill-current shrink-0 text-white" viewBox="0 0 384 512">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 51.9-12.9 69.5-34.3z" />
  </svg>
);


export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp }) => {
  const [showIosTutorial, setShowIosTutorial] = useState(false);
  const [showPlayStoreNotice, setShowPlayStoreNotice] = useState(false);

  const previews = [
    { title: 'Status & Turno de Hoje', description: 'Saiba se está de folga ou plantão em tempo real', img: '/preview1.png' },
    { title: 'Calendário Interativo 3x3', description: 'Visualize a escala de meses inteiros com feriados 100%', img: '/preview2.png' },
    { title: 'Gestão de Férias & Folgas', description: 'Cadastre suas férias e saiba o retorno exato', img: '/preview3.png' },
    { title: 'Perfil & Turma (A, B, C, D)', description: 'Configure sua data-base e altere turmas facilmente', img: '/preview4.png' },
    { title: 'Configuração & Tema Escuro', description: 'Modo escuro confortável e suporte nativo', img: '/preview5.png' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Luz de Fundo sutil em tom Azul Royal de acordo com o App */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/25 via-indigo-900/10 to-transparent pointer-events-none blur-3xl"></div>

      {/* Header / Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Turno 3x3" className="h-12 w-auto object-contain shrink-0" />
            <div>
              <span className="text-xl font-black tracking-tight text-white uppercase block leading-none">Turno 3x3</span>
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">Gestão de Escalas</span>
            </div>
          </div>





          {/* Links Centrais */}
          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <a href="#features" className="hover:text-blue-400 transition-colors">Recursos</a>
            <a href="#previews" className="hover:text-blue-400 transition-colors">Telas do App</a>
            <a href="#sobre" className="hover:text-blue-400 transition-colors">Sobre</a>
          </div>

          {/* Botão de Entrada Direta */}
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer"
          >
            Acessar Web <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section (Inspiração Travexa) */}
      <header className="max-w-5xl mx-auto px-6 pt-12 pb-16 text-center relative z-10 space-y-8">
        
        {/* Badge de Membros no Topo */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-300 shadow-md">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-5 w-5 rounded-full bg-blue-500 ring-2 ring-slate-900 text-[10px] text-white flex items-center justify-center font-black">A</div>
            <div className="inline-block h-5 w-5 rounded-full bg-purple-500 ring-2 ring-slate-900 text-[10px] text-white flex items-center justify-center font-black">B</div>
            <div className="inline-block h-5 w-5 rounded-full bg-amber-500 ring-2 ring-slate-900 text-[10px] text-white flex items-center justify-center font-black">C</div>
          </div>
          <span className="text-slate-300">Mais de <strong>5.000 Operadores</strong></span>
          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Escala 3x3</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          O Futuro da Inteligência em <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
            Escalas & Bem-estar
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Não apenas trabalhe por turnos — planeje suas folgas com clareza. O Turno 3x3 sincroniza seus plantões de Dia ☀️ e Noite 🌙 com feriados 100% para você ter o controle real do seu tempo.
        </p>

        {/* BOTÕES OFICIAIS DE PLATAFORMA (GOOGLE PLAY STORE & APPLE APP STORE / PWA) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          
          {/* BOTÃO GOOGLE PLAY STORE (DESATIVADO PARA DOWNLOAD / COM AVISO EM BREVE) */}
          <button
            type="button"
            onClick={() => setShowPlayStoreNotice(true)}
            className="w-full sm:w-auto min-w-[220px] flex items-center justify-between px-5 py-3 bg-slate-900 hover:bg-slate-850 text-white border border-slate-700/80 rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer relative group"
          >
            <div className="flex items-center gap-3">
              <GooglePlayIcon />
              <div className="text-left">
                <span className="text-[9px] uppercase font-extrabold text-slate-400 block tracking-widest leading-none">DISPONÍVEL EM BREVE NA</span>
                <span className="text-sm font-black text-white leading-tight">Google Play</span>
              </div>
            </div>
            <span className="ml-3 px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
              Em Breve
            </span>
          </button>

          {/* BOTÃO APPLE APP STORE / PWA (OPÇÃO DE USAR PWA) */}
          <button
            type="button"
            onClick={() => setShowIosTutorial(true)}
            className="w-full sm:w-auto min-w-[220px] flex items-center justify-between px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <AppleIcon />
              <div className="text-left">
                <span className="text-[9px] uppercase font-extrabold text-slate-400 block tracking-widest leading-none">USAR VERSÃO WEB NA</span>
                <span className="text-sm font-black text-white leading-tight">App Store / PWA</span>
              </div>
            </div>
            <span className="ml-3 px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
              Usar PWA
            </span>
          </button>
        </div>

        {/* MOCKUP SHOWCASE TRIPLO (3 CELULARES) */}
        <div className="pt-10 relative max-w-4xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="grid grid-cols-3 items-center gap-2 sm:gap-6 relative z-10">
            <div className="transform -rotate-6 translate-y-6 sm:translate-y-8 opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-105">
              <div className="bg-slate-900 p-1.5 sm:p-2.5 rounded-[1.8rem] sm:rounded-[2.5rem] border-4 sm:border-[6px] border-slate-800 shadow-2xl overflow-hidden">
                <img src="/preview2.png" alt="Calendário 3x3" className="w-full h-auto rounded-[1.2rem] sm:rounded-[2rem] object-cover" />
              </div>
            </div>

            <div className="z-20 transform hover:scale-105 transition-transform duration-500 shadow-2xl">
              <div className="bg-slate-900 p-2 sm:p-3 rounded-[2rem] sm:rounded-[3rem] border-4 sm:border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-4 ring-blue-500/20">
                <img src="/preview1.png" alt="Status de Hoje" className="w-full h-auto rounded-[1.5rem] sm:rounded-[2.4rem] object-cover" />
              </div>
            </div>

            <div className="transform rotate-6 translate-y-6 sm:translate-y-8 opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-105">
              <div className="bg-slate-900 p-1.5 sm:p-2.5 rounded-[1.8rem] sm:rounded-[2.5rem] border-4 sm:border-[6px] border-slate-800 shadow-2xl overflow-hidden">
                <img src="/preview3.png" alt="Férias e Folgas" className="w-full h-auto rounded-[1.2rem] sm:rounded-[2rem] object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Faixa de Recursos Pills */}
        <div id="features" className="pt-16">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-6">
            Nossos Recursos em Destaque
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 rounded-full border border-slate-800 text-xs font-extrabold text-slate-300 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Escala 3x3 Automática
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 rounded-full border border-slate-800 text-xs font-extrabold text-slate-300 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Trocas Dia ☀️ / Noite 🌙
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 rounded-full border border-slate-800 text-xs font-extrabold text-slate-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Feriados 100%
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 rounded-full border border-slate-800 text-xs font-extrabold text-slate-300 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 100% Offline (PWA)
            </div>
          </div>
        </div>
      </header>

      {/* SEÇÃO 2: PÚBLICO ALVO & SHOWCASE INTERATIVO */}
      <section id="previews" className="py-20 border-t border-slate-900 bg-slate-950/60 relative">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Projete um estilo de vida de trabalho mais inteligente com um layout que mantém suas <span className="text-blue-400">folgas e plantões</span> simples de acompanhar.
            </h2>
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 pt-4">
              Público Alvo
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {['#Mineração', '#IndústriaSiderúrgica', '#OperadoresDeCampo', '#Turno3x3', '#Manutenção'].map((tag, i) => (
                <span key={i} className="px-3.5 py-1.5 bg-slate-900 border border-slate-800/80 rounded-full text-xs font-bold text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* GALERIA DE TELAS DO APP (PRINTS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-10">
            {previews.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-3xl p-2.5 border border-slate-800 shadow-xl hover:border-blue-500/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="rounded-2xl border border-slate-800 overflow-hidden mb-3">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-auto rounded-xl object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
                <div className="p-2 space-y-1 text-left">
                  <h3 className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-12 text-slate-500 text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2">
            <span>Trabalhe com Propósito, Não Apenas por Horas</span>
            <div className="flex gap-1.5 ml-2">
              <span className="h-2 w-2 rounded-full bg-blue-600 inline-block"></span>
              <span className="h-2 w-2 rounded-full bg-slate-700 inline-block"></span>
              <span className="h-2 w-2 rounded-full bg-slate-700 inline-block"></span>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE AVISO: EM BREVE NA GOOGLE PLAY STORE */}
      {showPlayStoreNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <button
              onClick={() => setShowPlayStoreNotice(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30">
                <GooglePlayIcon />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white">Disponível em Breve!</h3>
                <p className="text-xs text-amber-400 font-bold">Google Play Store</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-medium">
              <p>
                O aplicativo <strong>Turno 3x3</strong> está em fase final de publicação oficial na <strong>Google Play Store</strong>.
              </p>
              <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 flex items-start gap-2.5 text-slate-200">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Você já pode usar a versão <strong>PWA (Web App)</strong> agora mesmo no seu celular Android ou iPhone com suporte 100% offline!
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowPlayStoreNotice(false);
                  onEnterApp();
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-xl transition-all cursor-pointer"
              >
                Usar Versão Web PWA Agora <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE INSTRUÇÃO PARA IOS / PWA */}
      {showIosTutorial && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-blue-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <button
              onClick={() => setShowIosTutorial(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400 border border-blue-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white">Como Usar o PWA no seu Celular</h3>
                <p className="text-xs text-blue-400 font-bold">Funciona no iPhone (iOS) e Android</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
                <div className="w-7 h-7 bg-blue-600 text-white font-black rounded-xl flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-0.5">Abra no Navegador (Safari / Chrome)</p>
                  <p className="text-slate-300">
                    Toque no botão de <strong>Compartilhar</strong> (<Share className="inline w-3.5 h-3.5 text-blue-400" />) ou nos 3 pontinhos do navegador.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
                <div className="w-7 h-7 bg-blue-600 text-white font-black rounded-xl flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-0.5">Selecione "Adicionar à Tela de Início"</p>
                  <p className="text-slate-300">
                    Toque em <PlusSquare className="inline w-3.5 h-3.5 text-blue-400" /> <strong>"Adicionar à Tela de Início"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
                <div className="w-7 h-7 bg-emerald-600 text-white font-black rounded-xl flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-0.5">Pronto! Use como App Nativo</p>
                  <p className="text-slate-300">
                    O ícone do <strong>Turno 3x3</strong> aparecerá na sua tela inicial como um app nativo, funcionando 100% offline!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowIosTutorial(false);
                  onEnterApp();
                }}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-950/60 transition-all active:scale-95 cursor-pointer"
              >
                Abrir App Web PWA Agora <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé Oficial Vertex */}
      <footer id="sobre" className="bg-slate-950 border-t border-slate-900 text-white py-12 text-xs">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Turno 3x3" className="h-14 w-auto object-contain shrink-0" />
            <div>
              <span className="font-black text-white text-sm uppercase tracking-tight block leading-none">Turno 3x3</span>
              <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-0.5 block">Um Produto VERTEX</span>
            </div>
          </div>





          <div className="text-center md:text-right space-y-1">
            <p className="text-slate-300 font-bold text-xs">
              © 2026 <strong>Turno 3x3</strong> • Um produto <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-black tracking-wider uppercase">VERTEX</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Tecnologia e Soluções Inteligentes em Escalas de Revezamento.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

