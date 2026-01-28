
import React, { useState } from 'react';
import { Client } from '../types';
import { Save, X, Phone, User, DollarSign, Calendar, MessageSquare } from 'lucide-react';

interface ClientFormProps {
  client?: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

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
    if (!formData.name || !formData.phone) {
      alert('Nome e Telefone são obrigatórios.');
      return;
    }

    const finalClient: Client = {
      ...formData as Client,
      id: client?.id || Date.now().toString(),
      createdAt: client?.createdAt || new Date().toISOString(),
      status: formData.status || 'Novo'
    };

    onSave(finalClient);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {client ? 'Editar Cliente' : 'Novo Cadastro'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl overflow-hidden p-6 space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ex: João Silva"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Phone and WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / Celular</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="tel"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex items-center mt-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                checked={formData.hasWhatsApp}
                onChange={e => setFormData({ ...formData, hasWhatsApp: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Possui WhatsApp?</span>
            </label>
          </div>
        </div>

        {/* Energy Bill Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Conta (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="0.00"
                value={formData.billValue || ''}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setFormData({ ...formData, billValue: val, isLowBill: val < 150 });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                checked={formData.isLowBill}
                onChange={e => setFormData({ ...formData, isLowBill: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Conta de luz é baixa?</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                checked={formData.isLowIncomeProgram}
                onChange={e => setFormData({ ...formData, isLowIncomeProgram: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Programa Baixa Renda?</span>
            </label>
          </div>
        </div>

        {/* Return Date and Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora para Retorno</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="datetime-local"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.returnDateTime}
              onChange={e => setFormData({ ...formData, returnDateTime: e.target.value })}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              rows={4}
              placeholder="Digite detalhes do interesse, melhor horário, etc."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status do Lead</label>
          <select
            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
          >
            <option value="Novo">Novo</option>
            <option value="Contatado">Contatado</option>
            <option value="Fechado">Fechado</option>
            <option value="Perdido">Perdido</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-emerald-600 px-4 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <Save size={20} />
            Salvar Cliente
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
