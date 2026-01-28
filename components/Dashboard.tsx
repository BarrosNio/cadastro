
import React from 'react';
import { Client } from '../types';
import { TrendingUp, Users, DollarSign, Clock, Plus, ChevronRight, Zap, Target } from 'lucide-react';

interface DashboardProps {
  clients: Client[];
  onViewList: () => void;
  onAddClient: () => void;
  onSelectClient: (client: Client) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ clients, onViewList, onAddClient, onSelectClient }) => {
  const totalLeads = clients.length;
  const highBillLeads = clients.filter(c => c.billValue >= 500).length;
  const closedDeals = clients.filter(c => c.status === 'Fechado').length;
  const pendingRetours = clients.filter(c => c.returnDateTime && new Date(c.returnDateTime) >= new Date()).length;

  const recentLeads = [...clients].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-slate-500 font-medium">Confira seu progresso hoje</p>
        </div>
        <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2">
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<Users size={20} />} label="Leads" value={totalLeads} color="blue" />
        <MetricCard icon={<TrendingUp size={20} />} label="Premium" value={highBillLeads} color="amber" />
        <MetricCard icon={<Target size={20} />} label="Conversão" value={closedDeals} color="emerald" />
        <MetricCard icon={<Clock size={20} />} label="Retornos" value={pendingRetours} color="purple" />
      </div>

      {/* Main Banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 bg-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-brand-500/30">
              Oportunidade
            </span>
          </div>
          <h3 className="text-2xl font-black mb-2 leading-tight max-w-xs">
            Aumente suas vendas hoje.
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm font-medium leading-relaxed">
            Nossa IA identificou que leads com conta acima de R$ 500 têm 40% mais chance de fechamento.
          </p>
          <button 
            onClick={onAddClient}
            className="group flex items-center gap-3 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-brand-900/20 active:scale-95"
          >
            Novo Lead
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* Section: Leads */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recentes</h3>
            <div className="h-1 w-8 bg-brand-500 rounded-full mt-1"></div>
          </div>
          <button 
            onClick={onViewList}
            className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Ver todos <ChevronRight size={16} />
          </button>
        </div>

        {recentLeads.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-medium">Sua lista está vazia por enquanto.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {recentLeads.map(lead => (
              <div 
                key={lead.id}
                onClick={() => onSelectClient(lead)}
                className="group bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:border-brand-200 hover:shadow-md hover:shadow-brand-500/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{lead.name}</h4>
                    <p className="text-xs font-semibold text-slate-400">R$ {lead.billValue.toFixed(2)} • <span className="text-slate-500">{lead.status}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-black text-slate-300 uppercase">Criado em</p>
                     <p className="text-[10px] font-bold text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</p>
                   </div>
                   <ChevronRight size={20} className="text-slate-200 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    purple: 'bg-purple-50 text-purple-600 ring-purple-100',
  };

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3 ring-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-0.5">{label}</div>
    </div>
  );
};

export default Dashboard;
