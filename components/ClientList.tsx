
import React from 'react';
import { Client } from '../types';
import { ChevronRight, Phone, MessageCircle, AlertCircle, Calendar, Zap } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient }) => {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Sem resultados</h3>
        <p className="text-slate-500 max-w-xs font-medium">Não encontramos clientes com esses critérios de busca.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {clients.map(client => (
        <div 
          key={client.id}
          onClick={() => onSelectClient(client)}
          className="group bg-white p-4 sm:p-5 rounded-[1.5rem] border border-slate-200/80 shadow-sm flex items-center gap-4 active:scale-[0.98] hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 transition-all cursor-pointer"
        >
          {/* Avatar Area */}
          <div className="relative flex-shrink-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
              client.billValue >= 500 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
            }`}>
              <span className="font-black text-xl">{client.name.charAt(0)}</span>
            </div>
            {client.hasWhatsApp && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg border-2 border-white flex items-center justify-center shadow-md">
                {/* Fix: Used MessageCircle instead of missing/unused MessageSquare */}
                <MessageCircle size={12} className="text-white fill-current" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1.5">
              <h3 className="font-extrabold text-slate-900 truncate pr-2 leading-tight">{client.name}</h3>
              <div className="text-sm font-black text-slate-900 whitespace-nowrap">R$ {client.billValue.toFixed(0)}</div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                client.status === 'Novo' ? 'bg-blue-50 text-blue-700' :
                client.status === 'Contatado' ? 'bg-amber-50 text-amber-700' :
                client.status === 'Fechado' ? 'bg-emerald-50 text-emerald-700' :
                'bg-slate-50 text-slate-600'
              }`}>
                {client.status}
              </span>
              
              {client.isLowIncomeProgram && (
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                  Social
                </span>
              )}
              
              {client.billValue >= 500 && (
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                  <Zap size={10} className="fill-current" /> High Value
                </span>
              )}
            </div>

            {client.returnDateTime && (
              <div className="mt-2.5 text-[10px] font-bold text-brand-600 flex items-center gap-1.5 bg-brand-50/50 w-fit px-3 py-1 rounded-lg">
                <Calendar size={12} /> 
                Retorno: {new Date(client.returnDateTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
              </div>
            )}
          </div>

          <ChevronRight className="text-slate-200 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0" size={24} />
        </div>
      ))}
    </div>
  );
};

export default ClientList;
