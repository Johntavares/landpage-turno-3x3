import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Activity, WifiOff, Smartphone, RefreshCw, Lock, ArrowLeft, CheckCircle2, Search, Database, Image, Plus, Trash2, ToggleLeft, ToggleRight, Link as LinkIcon, Save } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { fetchAdminStats } from '../../services/telemetry';
import type { AccessLog } from '../../services/telemetry';
import { getLocalAds, saveManagedAd, deleteManagedAd, toggleManagedAd } from '../../services/storage';
import type { Ad } from '../../types';
import { useAppStore } from '../../stores/appStore';

interface AdminViewProps {
  onBack: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de Gerenciamento de Banners
  const [managedAds, setManagedAds] = useState<Ad[]>([]);
  const [adTitle, setAdTitle] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adLocation, setAdLocation] = useState<'HOME' | 'PROFILE'>('HOME');
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  const { loadAds } = useAppStore();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin3x3' || adminPassword === 'silva123') {
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      alert('Senha incorreta! Digite a senha administrativa correta.');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    const data = await fetchAdminStats();
    setProfiles(data.profiles);
    setAccessLogs(data.accessLogs as AccessLog[]);
    
    // Carregar Banners Gerenciados
    const ads = getLocalAds();
    setManagedAds(ads);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Salvar / Adicionar novo Banner Promocional
  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adImageUrl.trim()) {
      alert('Preencha o título e a URL da imagem do banner.');
      return;
    }

    const newAd: Ad = {
      id: editingAdId || 'ad_' + Date.now(),
      title: adTitle.trim(),
      imageUrl: adImageUrl.trim(),
      link: adLink.trim() || '#',
      active: true,
      displayOrder: 1,
      location: adLocation,
    };

    const updated = saveManagedAd(newAd);
    setManagedAds(updated);
    loadAds(); // Atualiza a store global do React

    // Reset formulário
    setAdTitle('');
    setAdImageUrl('');
    setAdLink('');
    setEditingAdId(null);
    alert(editingAdId ? 'Banner atualizado com sucesso!' : 'Novo banner publicado com sucesso!');
  };

  const handleEditAd = (ad: Ad) => {
    setEditingAdId(ad.id);
    setAdTitle(ad.title);
    setAdImageUrl(ad.imageUrl);
    setAdLink(ad.link);
    setAdLocation((ad.location as 'HOME' | 'PROFILE') || 'HOME');
  };


  const handleDeleteAd = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      const updated = deleteManagedAd(id);
      setManagedAds(updated);
      loadAds();
    }
  };

  const handleToggleAd = (id: string) => {
    const updated = toggleManagedAd(id);
    setManagedAds(updated);
    loadAds();
  };

  // Se não estiver autenticado, exibe a tela de login de segurança do Admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 space-y-6 border-2 border-slate-800 bg-slate-900 text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Painel Administrativo</h2>
                <p className="text-xs text-slate-400">Área de gestão e métricas do Turno 3x3</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Senha Administrativa
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Digite a senha de acesso..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium text-sm focus:outline-hidden focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
            >
              Acessar Painel Admin
            </button>
          </form>
        </Card>
      </div>
    );
  }

  // Cálculos das métricas
  const totalUsers = profiles.length;
  const totalLogs = accessLogs.length;
  const offlineLogsCount = accessLogs.filter((l) => l.isOffline).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAccessCount = accessLogs.filter((l) => l.timestamp && l.timestamp.startsWith(todayStr)).length;

  const teamCounts = {
    A: profiles.filter((p) => p.team === 'A').length,
    B: profiles.filter((p) => p.team === 'B').length,
    C: profiles.filter((p) => p.team === 'C').length,
    D: profiles.filter((p) => p.team === 'D').length,
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cabeçalho do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-400" /> Painel de Gestão & Métricas
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Monitoramento de acessos online/offline e gerenciador de anúncios/banners.
            </p>
          </div>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sincronizar Agora
        </button>
      </div>

      {/* Cartões Executivos de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Usuários Totais</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalUsers}</div>
          <p className="text-[10px] text-slate-400 font-medium">Cadastrados no banco PostgreSQL</p>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Acessos Hoje</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{todayAccessCount}</div>
          <p className="text-[10px] text-slate-400 font-medium">Sessões computadas nas 24h</p>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Acessos Offline</span>
            <WifiOff className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{offlineLogsCount}</div>
          <p className="text-[10px] text-slate-400 font-medium">Sincronizados após reconectar</p>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total de Sessões</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalLogs}</div>
          <p className="text-[10px] text-slate-400 font-medium">Registros em tempo real</p>
        </Card>
      </div>

      {/* SEÇÃO NOVISSIMA: GERENCIADOR DE BANNERS & ANÚNCIOS */}
      <Card className="space-y-6 bg-slate-900 border-2 border-blue-500/40 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Gerenciador de Banners & Anúncios Próprios</h3>
              <p className="text-xs text-slate-400 font-medium">
                Crie e altere banners promocionais exibidos na Home e no Perfil do app.
              </p>
            </div>
          </div>
          {editingAdId && (
            <button
              onClick={() => {
                setEditingAdId(null);
                setAdTitle('');
                setAdImageUrl('');
                setAdLink('');
              }}
              className="text-xs text-amber-400 hover:underline font-bold"
            >
              Cancelar Edição
            </button>
          )}
        </div>

        {/* Form para Adicionar / Editar Banner */}
        <form onSubmit={handleSaveAd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Título do Banner
            </label>
            <input
              type="text"
              required
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              placeholder="ex: Oferta Especial para Operadores"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              URL da Imagem / Mídia
            </label>
            <div className="relative">
              <Image className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="url"
                required
                value={adImageUrl}
                onChange={(e) => setAdImageUrl(e.target.value)}
                placeholder="https://sua-imagem.com/banner.jpg"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Link de Destino / Redirecionamento
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={adLink}
                onChange={(e) => setAdLink(e.target.value)}
                placeholder="https://seu-site.com ou #"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Página de Exibição
            </label>
            <select
              value={adLocation}
              onChange={(e) => setAdLocation(e.target.value as 'HOME' | 'PROFILE')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="HOME">Página Inicial (HOME)</option>
              <option value="PROFILE">Página do Perfil (PROFILE)</option>
            </select>
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {editingAdId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingAdId ? 'Atualizar Banner' : 'Publicar Novo Banner'}
            </button>
          </div>
        </form>

        {/* Tabela de Banners Ativos e Inativos */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Banners Ativos ({managedAds.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managedAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <h5 className="font-extrabold text-xs text-white line-clamp-1">{ad.title}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-500/30">
                        {ad.location === 'PROFILE' ? 'Perfil' : 'Home'}
                      </span>
                      <span className={`text-[10px] font-bold ${ad.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {ad.active ? 'Ativo' : 'Pausado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggleAd(ad.id)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title={ad.active ? 'Pausar Banner' : 'Ativar Banner'}
                  >
                    {ad.active ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                  </button>
                  <button
                    onClick={() => handleEditAd(ad)}
                    className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Editar Banner"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAd(ad.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Excluir Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Distribuição por Turma (A, B, C, D) */}
      <Card className="space-y-3 bg-slate-900 border-slate-800">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Distribuição de Operadores por Turma
        </h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block">Turma A</span>
            <span className="text-xl font-black text-blue-400">{teamCounts.A}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block">Turma B</span>
            <span className="text-xl font-black text-purple-400">{teamCounts.B}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block">Turma C</span>
            <span className="text-xl font-black text-amber-400">{teamCounts.C}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block">Turma D</span>
            <span className="text-xl font-black text-emerald-400">{teamCounts.D}</span>
          </div>
        </div>
      </Card>

      {/* Tabela de Usuários Cadastrados */}
      <Card className="space-y-4 bg-slate-900 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> Usuários Cadastrados ({filteredProfiles.length})
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="py-2.5 px-3">Nome</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Turma</th>
                <th className="py-2.5 px-3">Data Base</th>
                <th className="py-2.5 px-3">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{p.name || 'Operador'}</td>
                    <td className="py-3 px-3">{p.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 font-black text-[10px] border border-blue-500/30">
                        Equipe {p.team}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">{p.baseDate}</td>
                    <td className="py-3 px-3 text-slate-400">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR') : 'Sem data'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Histórico Recente de Telemetria e Acessos */}
      <Card className="space-y-4 bg-slate-900 border-slate-800">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" /> Registro em Tempo Real de Acessos ({accessLogs.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="py-2.5 px-3">Usuário</th>
                <th className="py-2.5 px-3">Turma</th>
                <th className="py-2.5 px-3">Modo</th>
                <th className="py-2.5 px-3">Plataforma</th>
                <th className="py-2.5 px-3">Horário / Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {accessLogs.length > 0 ? (
                accessLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{log.userEmail || 'anonimo@turno3x3.app'}</td>
                    <td className="py-3 px-3">Turma {log.team || 'A'}</td>
                    <td className="py-3 px-3">
                      {log.isOffline ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                          <WifiOff className="w-3 h-3" /> Offline Sincronizado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Online Direto
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-slate-500" /> {log.platform || 'Web/Mobile'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString('pt-BR') : '--'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                    Nenhum registro de acesso coletado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
