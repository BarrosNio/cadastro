
import React from 'react';
import { Client } from '../types';
import { TrendingUp, Users, DollarSign, Clock, Plus, ChevronRight, Zap } from 'lucide-react';

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
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="bg-blue-100 p-2 rounded-full mb-2 text-blue-600">
            <Users size={20} />
          </div>
          <span className="text-2xl font-bold">{totalLeads}</span>
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Total Leads</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="bg-orange-100 p-2 rounded-full mb-2 text-orange-600">
            <TrendingUp size={20} />
          </div>
          <span className="text-2xl font-bold">{highBillLeads}</span>
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Conta Alta</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="bg-emerald-100 p-2 rounded-full mb-2 text-emerald-600">
            <DollarSign size={20} />
          </div>
          <span className="text-2xl font-bold">{closedDeals}</span>
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Fechados</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="bg-purple-100 p-2 rounded-full mb-2 text-purple-600">
            <Clock size={20} />
          </div>
          <span className="text-2xl font-bold">{pendingRetours}</span>
          <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Retornos</span>
        </div>
      </div>

      {/* Main Action Call */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <Zap className="absolute -right-8 -top-8 text-white opacity-20" size={120} />
        <h2 className="text-xl font-bold mb-2">Pronto para vender?</h2>
        <p className="text-emerald-50 opacity-90 text-sm mb-4 max-w-[70%]">
          Cadastre novos clientes agora e receba lembretes automáticos para não perder nenhuma oportunidade.
        </p>
        <button 
          onClick={onAddClient}
          className="bg-white text-emerald-600 px-6 py-2 rounded-full font-bold shadow-md transform active:scale-95 transition-transform flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Lead
        </button>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Recém Adicionados</h3>
          <button 
            onClick={onViewList}
            className="text-emerald-600 text-sm font-bold flex items-center gap-1"
          >
            Ver Todos <ChevronRight size={16} />
          </button>
        </div>

        {recentLeads.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-gray-200">
            <p className="text-gray-400 italic">Nenhum cliente cadastrado ainda.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {recentLeads.map(lead => (
              <div 
                key={lead.id}
                onClick={() => onSelectClient(lead)}
                className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{lead.name}</h4>
                    <p className="text-xs text-gray-400">R$ {lead.billValue.toFixed(2)} • {lead.status}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
