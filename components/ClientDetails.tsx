
import React, { useState } from 'react';
import { Client } from '../types';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Phone, 
  MessageCircle, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle,
  Zap,
  Sparkles,
  ChevronRight,
  Share2
} from 'lucide-react';
import { getSalesAdvice } from '../services/geminiService';

interface ClientDetailsProps {
  client: Client;
  onEdit: () => void;
  onBack: () => void;
  onDelete: () => void;
  onUpdate: (client: Client) => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, onEdit, onBack, onDelete, onUpdate }) => {
  const [advice, setAdvice] = useState<{ pitch: string; strategy: string; potential_savings: string } | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleStatusToggle = () => {
    const statusMap: Record<string, string> = {
      'Novo': 'Contatado',
      'Contatado': 'Fechado',
      'Fechado': 'Perdido',
      'Perdido': 'Novo'
    };
    onUpdate({ ...client, status: (statusMap[client.status] || 'Novo') as any });
  };

  const generateAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getSalesAdvice(client);
    if (result) setAdvice(result);
    setLoadingAdvice(false);
  };

  const openWhatsApp = () => {
    const phone = client.phone.replace(/\D/g, '');
    const message = advice ? advice.pitch : `Olá ${client.name}, tudo bem? Sou o consultor de energia. Vi seu interesse no desconto da conta de luz e gostaria de bater um papo.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-32 animate-in fade-in duration-500">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack} 
          className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button onClick={onEdit} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-brand-600 hover:bg-brand-50 transition-all shadow-sm">
            <Edit size={20} />
          </button>
          <button onClick={onDelete} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all shadow-sm">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden mb-8">
        <div className="bg-slate-900 px-8 py-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-brand-600 ring-4 ring-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <span className="text-4xl font-black text-white">{client.name.charAt(0)}</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{client.name}</h2>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                client.status === 'Novo' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                client.status === 'Contatado' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                client.status === 'Fechado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {client.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Quick Bar */}
        <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50/50 border-b border-slate-100">
          <button 
            onClick={() => window.location.href = `tel:${client.phone}`}
            className="flex items-center justify-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm group"
          >
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
              <Phone size={20} />
            </div>
            <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Ligar</span>
          </button>
          <button 
            onClick={openWhatsApp}
            className="flex items-center justify-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm group"
          >
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <MessageCircle size={20} />
            </div>
            <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Zap</span>
          </button>
        </div>

        {/* Details Grid */}
        <div className="p-8 space-y-8">
          <DetailItem 
            icon={<DollarSign size={20} />} 
            label="Perfil Financeiro" 
            value={`R$ ${client.billValue.toLocaleString()}`}
            badge={client.isLowIncomeProgram ? "Baixa Renda" : client.billValue >= 500 ? "Lead Premium" : "Residencial"}
          />
          
          <DetailItem 
            icon={<Calendar size={20} />} 
            label="Próximo Contato" 
            value={client.returnDateTime ? new Date(client.returnDateTime).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' }) : 'Não agendado'}
          />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-400">
              <FileText size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Anotações</span>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-sm font-medium text-slate-600 italic leading-relaxed">
              {client.notes || 'Nenhuma observação registrada para este cliente.'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Section - Premium Card */}
      <div className="relative group mb-8">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-[2.5rem] opacity-30 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-slate-900 rounded-[2.5rem] p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="text-brand-400" size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight">EcoAssistant AI</h3>
                <p className="text-[10px] text-brand-400/80 font-bold uppercase tracking-widest">Sugestão de abordagem</p>
              </div>
            </div>
            {advice && (
               <button 
                 onClick={() => setAdvice(null)}
                 className="text-[10px] font-black uppercase text-slate-500 hover:text-white"
               >
                 Recarregar
               </button>
            )}
          </div>
          
          {advice ? (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <p className="text-sm font-medium text-slate-300 italic mb-4">"{advice.pitch}"</p>
                <button 
                  onClick={openWhatsApp}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <Share2 size={16} /> Enviar Sugestão
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">Economia</p>
                  <p className="text-lg font-black">{advice.potential_savings}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Dica Extra</p>
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">{advice.strategy}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400 mb-6 font-medium">Use nossa inteligência artificial para criar um script de venda personalizado.</p>
              <button 
                onClick={generateAdvice}
                disabled={loadingAdvice}
                className="group relative inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-brand-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {loadingAdvice ? 'Processando...' : (
                  <>
                    <Zap size={18} className="text-brand-500 group-hover:text-white" />
                    Gerar Script Inteligente
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleStatusToggle}
        className="w-full bg-white border border-slate-200 p-5 rounded-[2rem] flex items-center justify-between font-black text-xs uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
      >
        <div className="flex items-center gap-4">
          <CheckCircle size={24} className={client.status === 'Fechado' ? 'text-brand-600' : 'text-slate-200'} />
          <span>Alterar Fluxo de Lead</span>
        </div>
        <ChevronRight size={18} className="text-slate-300" />
      </button>
    </div>
  );
};

const DetailItem = ({ icon, label, value, badge }: { icon: any, label: string, value: string, badge?: string }) => (
  <div className="flex items-start gap-5">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-lg font-black text-slate-900 tracking-tight">{value}</p>
        {badge && (
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-200">
            {badge}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default ClientDetails;
