import React, { useState } from 'react';
import { Download, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const DownloadView: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      
      const link = document.createElement('a');
      link.href = '/app-debug.apk';
      link.download = 'app-debug.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  const previews = [
    { src: '/preview1.png', label: '1. Login & Registro' },
    { src: '/preview2.png', label: '2. Status de Trabalho' },
    { src: '/preview3.png', label: '3. Calendário da Escala' },
    { src: '/preview4.png', label: '4. Perfil & Equipe' },
    { src: '/preview5.png', label: '5. Ajustes & Notificações' },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Branding com Logo Oficial */}
      <div className="text-center space-y-3">
        <img 
          src="/logo.jpg" 
          alt="Logo Oficial Turno 3x3" 
          className="w-24 h-24 rounded-3xl mx-auto shadow-2xl shadow-amber-500/20 border-2 border-slate-200 dark:border-slate-800 object-cover"
        />
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          TURNO <span className="text-amber-500">3X3</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Portal Oficial de Download do APK Android (.APK)
        </p>
      </div>

      {/* Card Principal */}
      <Card className="w-full space-y-5 border-amber-500/30 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pacote Compilado Oficial</span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">app-debug.apk (v2.4.0)</h3>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold rounded-full">
            PRONTO PARA INSTALAR
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">Arquivo Compilado:</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">app-debug.apk</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">Tamanho Real:</span>
            <span className="font-bold text-slate-900 dark:text-white">9.3 MB (9.747.250 bytes)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-500 dark:text-slate-400">Requisito:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Android 8.0+</span>
          </div>
        </div>

        {downloaded && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Download do app-debug.apk iniciado! Verifique sua pasta Downloads.</span>
          </div>
        )}

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-blue-500 hover:from-amber-400 hover:to-blue-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Download className="h-5 w-5 stroke-[2.5]" />
          <span>{downloading ? 'SALVANDO ARQUIVO APK...' : 'BAIXAR APK REAL (app-debug.apk)'}</span>
        </button>
      </Card>

      {/* Carrossel de Prévia das Telas */}
      <Card className="w-full space-y-3 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Prévia das Telas do App
            </h4>
          </div>
          <span className="text-[10px] text-amber-500 font-medium">Arraste para o lado &rarr;</span>
        </div>

        <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory">
          {previews.map((item, index) => (
            <div key={index} className="flex-none w-44 snap-center space-y-1.5">
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
                <img src={item.src} alt={item.label} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <p className="text-[10px] font-bold text-center text-slate-600 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Guia de Instalação Simplificado */}
      <Card className="w-full space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Como Instalar no Celular:
        </h4>
        <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <li className="flex items-start space-x-2">
            <span className="font-bold text-amber-500 font-mono">1.</span>
            <span>Toque no botão laranja acima para baixar o arquivo.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold text-amber-500 font-mono">2.</span>
            <span>Abra a notificação de download e toque em <strong className="text-slate-900 dark:text-white">app-debug.apk</strong>.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold text-amber-500 font-mono">3.</span>
            <span>Toque em <strong className="text-slate-900 dark:text-white">Instalar</strong> e abra o aplicativo!</span>
          </li>
        </ol>
      </Card>

    </div>
  );
};
