
import React from 'react';
import { Client } from '../types';
import { ChevronRight, Phone, MessageSquare, AlertCircle, Calendar } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient }) => {
  if (clients.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={40} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600">Nenhum cliente encontrado</h3>
        <p className="text-gray-400">Cadastre um novo lead no botão + abaixo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {clients.map(client => (
        <div 
          key={client.id}
          onClick={() => onSelectClient(client)}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:bg-gray-50 cursor-pointer transition-colors"
        >
          {/* Visual indicator based on bill value */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${client.billValue >= 500 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
            <span className="font-bold text-lg">{client.name.charAt(0)}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 truncate">{client.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Phone size={14} /> {client.phone}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                client.status === 'Novo' ? 'bg-blue-100 text-blue-700' :
                client.status === 'Contatado' ? 'bg-yellow-100 text-yellow-700' :
                client.status === 'Fechado' ? 'bg-emerald-100 text-emerald-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {client.status}
              </span>
            </div>
            {client.returnDateTime && (
              <div className="mt-2 text-[10px] text-emerald-600 flex items-center gap-1 bg-emerald-50 w-fit px-2 py-0.5 rounded">
                <Calendar size={12} /> 
                Retorno: {new Date(client.returnDateTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-gray-900">R$ {client.billValue.toFixed(2)}</div>
            <ChevronRight className="text-gray-300 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientList;
