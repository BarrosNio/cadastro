
import React from 'react';
import { ArrowLeft, Table, Settings, Cpu, Smartphone } from 'lucide-react';

const GoogleSheetsGuide: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="p-4 max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Guia AppSheet</h2>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-emerald-600">
            <Table size={24} />
            <h3 className="font-bold text-lg">1. Configure sua Planilha</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Crie uma nova Planilha Google com as seguintes colunas na primeira linha:</p>
          <div className="bg-gray-50 p-3 rounded-lg text-[10px] font-mono grid grid-cols-2 gap-2 text-gray-500 uppercase font-bold">
            <span className="bg-white p-1 border rounded">ID</span>
            <span className="bg-white p-1 border rounded">NOME_CLIENTE</span>
            <span className="bg-white p-1 border rounded">TELEFONE</span>
            <span className="bg-white p-1 border rounded">POSSUI_WHATSAPP</span>
            <span className="bg-white p-1 border rounded">VALOR_CONTA</span>
            <span className="bg-white p-1 border rounded">CONTA_BAIXA</span>
            <span className="bg-white p-1 border rounded">BAIXA_RENDA</span>
            <span className="bg-white p-1 border rounded">DATA_HORA_RETORNO</span>
            <span className="bg-white p-1 border rounded">OBSERVACOES</span>
            <span className="bg-white p-1 border rounded">STATUS</span>
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Settings size={24} />
            <h3 className="font-bold text-lg">2. Crie o App</h3>
          </div>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
            <li>No Google Sheets, clique em <strong>Extensões > AppSheet > Criar App</strong>.</li>
            <li>No Editor AppSheet, vá em <strong>Data > Columns</strong> e ajuste os tipos (Phone, Currency, Yes/No, DateTime).</li>
            <li>Em <strong>UX > Views</strong>, mude a visualização principal para <strong>Deck</strong> ou <strong>Table</strong>.</li>
          </ol>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-orange-600">
            <Cpu size={24} />
            <h3 className="font-bold text-lg">3. Lembrete Automático</h3>
          </div>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
            <li>Vá em <strong>Automation</strong> no AppSheet.</li>
            <li>Clique em <strong>New Bot</strong>.</li>
            <li>Evento: <strong>Scheduled</strong> (diário ou quando mudar a data).</li>
            <li>Ação: <strong>Send a Notification</strong>.</li>
            <li>No corpo da mensagem, use: <code className="bg-gray-100 px-1 rounded text-pink-600">"Hora de ligar para: " & [NOME_CLIENTE]</code>.</li>
          </ol>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-purple-600">
            <Smartphone size={24} />
            <h3 className="font-bold text-lg">4. Finalize e Compartilhe</h3>
          </div>
          <p className="text-sm text-gray-600">
            Clique em <strong>Deploy</strong> e depois em <strong>Share</strong>. Envie o link para os vendedores. Eles poderão instalar o ícone na tela inicial do celular como um aplicativo.
          </p>
        </section>
      </div>
    </div>
  );
};

export default GoogleSheetsGuide;
