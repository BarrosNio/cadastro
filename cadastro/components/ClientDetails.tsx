
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
  Sparkles
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
    const nextStatus = client.status === 'Novo' ? 'Contatado' : client.status === 'Contatado' ? 'Fechado' : 'Novo';
    onUpdate({ ...client, status: nextStatus as any });
  };

  const generateAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getSalesAdvice(client);
    if (result) setAdvice(result);
    setLoadingAdvice(false);
  };

  const openWhatsApp = () => {
    const phone = client.phone.replace(/\D/g, '');
    const message = advice ? advice.pitch : `Olá ${client.name}, vi que você tem interesse em desconto na conta de luz. Podemos conversar?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${client.phone}`;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 bg-white rounded-full shadow-sm text-emerald-600">
            <Edit size={20} />
          </button>
          <button onClick={onDelete} className="p-2 bg-white rounded-full shadow-sm text-red-500">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
        <div className="bg-emerald-600 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/50">
            <span className="text-3xl font-bold">{client.name.charAt(0)}</span>
          </div>
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <div className="mt-2 inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
            {client.status}
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4 border-b border-gray-50">
          <button 
            onClick={handleCall}
            className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex flex-col items-center gap-1 hover:bg-emerald-100 transition-colors"
          >
            <Phone size={24} />
            <span className="text-xs font-bold uppercase tracking-wide">Ligar</span>
          </button>
          <button 
            onClick={openWhatsApp}
            className="bg-green-50 text-green-700 p-4 rounded-2xl flex flex-col items-center gap-1 hover:bg-green-100 transition-colors"
          >
            <MessageCircle size={24} />
            <span className="text-xs font-bold uppercase tracking-wide">WhatsApp</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><DollarSign size={20} /></div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Valor Médio da Conta</p>
              <p className="text-lg font-bold text-gray-800">R$ {client.billValue.toFixed(2)}</p>
              <div className="flex gap-2 mt-1">
                {client.isLowBill && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Conta Baixa</span>}
                {client.isLowIncomeProgram && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Baixa Renda</span>}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><Calendar size={20} /></div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Retorno Agendado</p>
              <p className="font-semibold text-gray-700">
                {client.returnDateTime ? new Date(client.returnDateTime).toLocaleString() : 'Não agendado'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><FileText size={20} /></div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-1">Observações</p>
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 whitespace-pre-wrap italic">
                {client.notes || 'Sem observações.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gemini AI Sales Advice */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-yellow-400" size={24} />
          <h3 className="font-bold text-lg">EcoAssistant AI</h3>
        </div>
        
        {advice ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <p className="text-xs font-bold text-indigo-200 uppercase mb-1">Dica de abordagem:</p>
              <div className="bg-white/10 p-4 rounded-xl text-sm italic border border-white/20">
                "{advice.pitch}"
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-indigo-200 uppercase">Economia Potencial</p>
                <p className="font-bold text-lg">{advice.potential_savings}</p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-indigo-200 uppercase">Estratégia</p>
                <p className="text-xs leading-tight">{advice.strategy}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={openWhatsApp}
                className="flex-1 bg-white text-indigo-600 py-2 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform"
              >
                Copiar e Abrir WhatsApp
              </button>
              <button 
                onClick={() => setAdvice(null)}
                className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-sm border border-indigo-400"
              >
                Limpar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-indigo-100 mb-4 italic">Analise este lead com IA para obter a melhor abordagem de venda.</p>
            <button 
              onClick={generateAdvice}
              disabled={loadingAdvice}
              className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {loadingAdvice ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent" />
                  Analisando...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Analisar Lead
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={handleStatusToggle}
        className="w-full bg-white border-2 border-gray-100 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <CheckCircle size={24} className={client.status === 'Fechado' ? 'text-emerald-500' : 'text-gray-300'} />
        {client.status === 'Novo' ? 'Marcar como Contatado' : 
         client.status === 'Contatado' ? 'Marcar como Fechado' : 'Voltar para Novo'}
      </button>
    </div>
  );
};

export default ClientDetails;
