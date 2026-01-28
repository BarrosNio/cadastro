
import React, { useState } from 'react';
import { Client } from '../types';
import { Save, X, Phone, User, DollarSign, Calendar, MessageSquare, Check, HelpCircle } from 'lucide-react';

interface ClientFormProps {
  client?: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

// Fix: Explicitly define types for FormSection props to include children
interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children }) => (
  <div className="bg-white/50 border border-slate-200/60 p-5 sm:p-6 rounded-[2rem] shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const CustomCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <button 
    type="button"
    onClick={() => onChange(!checked)}
    className="flex items-center gap-3 group transition-all text-left"
  >
    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
      checked ? 'bg-brand-500 border-brand-500 shadow-lg shadow-brand-500/20' : 'border-slate-200 bg-white'
    }`}>
      {checked && <Check size={14} className="text-white" />}
    </div>
    <span className={`text-sm font-bold transition-colors ${checked ? 'text-slate-900' : 'text-slate-400'}`}>
      {label}
    </span>
  </button>
);

const ClientForm: React.FC<ClientFormProps> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Client>>(
    client || {
      name: '',
      phone: '',
      hasWhatsApp: true,
      billValue: 0,
      isLowBill: false,
      isLowIncomeProgram: false,
      returnDateTime: '',
      notes: '',
      status: 'Novo'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const finalClient: Client = {
      ...formData as Client,
      id: client?.id || Date.now().toString(),
      createdAt: client?.createdAt || new Date().toISOString(),
      status: formData.status || 'Novo'
    };

    onSave(finalClient);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-32 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {client ? 'Ajustar Lead' : 'Adicionar Lead'}
          </h2>
          <p className="text-slate-500 font-medium">Preencha os detalhes do novo interessado</p>
        </div>
        <button 
          onClick={onCancel} 
          className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Card */}
        <FormSection title="Dados Pessoais" icon={<User size={16}/>}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-semibold"
                  placeholder="Ex: Pedro Henrique"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="tel"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-semibold"
                    placeholder="(11) 99999-0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex items-end pb-1">
                <CustomCheckbox 
                  label="Possui WhatsApp?" 
                  checked={!!formData.hasWhatsApp} 
                  onChange={v => setFormData({ ...formData, hasWhatsApp: v })} 
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Financial Card */}
        <FormSection title="Dados da Conta" icon={<DollarSign size={16}/>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Valor da Fatura (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="number"
                  step="0.01"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold text-lg"
                  placeholder="0.00"
                  value={formData.billValue || ''}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setFormData({ ...formData, billValue: val, isLowBill: val < 150 });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-3">
              <CustomCheckbox 
                label="Conta de luz é baixa?" 
                checked={!!formData.isLowBill} 
                onChange={v => setFormData({ ...formData, isLowBill: v })} 
              />
              <CustomCheckbox 
                label="Cadastro Baixa Renda?" 
                checked={!!formData.isLowIncomeProgram} 
                onChange={v => setFormData({ ...formData, isLowIncomeProgram: v })} 
              />
            </div>
          </div>
        </FormSection>

        {/* Scheduling Card */}
        <FormSection title="Agenda & Notas" icon={<Calendar size={16}/>}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Retorno de Contato</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="datetime-local"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-semibold"
                  value={formData.returnDateTime}
                  onChange={e => setFormData({ ...formData, returnDateTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Observações Livres</label>
              <textarea
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium min-h-[100px]"
                placeholder="Detalhes relevantes sobre o cliente..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
        </FormSection>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-4 rounded-2xl bg-white border border-slate-200 font-black text-xs uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-[2] bg-brand-600 px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 active:scale-[0.98]"
          >
            <Check size={18} />
            Confirmar Lead
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
