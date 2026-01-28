
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PlusCircle, 
  LayoutDashboard, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight, 
  Phone, 
  MessageCircle, 
  Filter,
  ArrowLeft,
  Calendar,
  DollarSign,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { Client, View } from './types';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import Dashboard from './components/Dashboard';
import ClientDetails from './components/ClientDetails';
import GoogleSheetsGuide from './components/GoogleSheetsGuide';

const STORAGE_KEY = 'ecocrm_clients';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reminders, setReminders] = useState<Client[]>([]);

  // Load clients
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setClients(JSON.parse(saved));
    }
  }, []);

  // Save clients
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  // Check for reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentReminders = clients.filter(c => {
        if (!c.returnDateTime) return false;
        const returnTime = new Date(c.returnDateTime);
        // If the scheduled time is within the next 5 minutes or was in the last 15 mins and status is not contacted
        const diff = returnTime.getTime() - now.getTime();
        return Math.abs(diff) < 1000 * 60 * 5 && c.status !== 'Contatado';
      });
      setReminders(currentReminders);
    }, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [clients]);

  const addClient = (client: Client) => {
    setClients(prev => [client, ...prev]);
    setView('list');
  };

  const updateClient = (updated: Client) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedClient(updated);
    setView('details');
  };

  const deleteClient = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(prev => prev.filter(c => c.id !== id));
      setView('list');
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setView('edit');
  };

  const handleDetails = (client: Client) => {
    setSelectedClient(client);
    setView('details');
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Notifications/Reminders bar */}
      {reminders.length > 0 && (
        <div className="bg-yellow-100 border-b border-yellow-200 p-2 text-center animate-pulse">
          <div className="flex items-center justify-center gap-2 text-yellow-800 font-bold">
            <Bell size={18} />
            Lembrete de Retorno: {reminders[0].name} ({new Date(reminders[0].returnDateTime).toLocaleTimeString()})
            <button 
              onClick={() => handleDetails(reminders[0])}
              className="ml-4 underline text-sm"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <DollarSign size={28} className="bg-white text-emerald-600 rounded-full p-1" />
          <h1 className="text-xl font-bold tracking-tight">EcoCRM</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('guide')} 
            className="p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <BookOpen size={18} />
            <span className="hidden sm:inline">Guia AppSheet</span>
          </button>
          <div className="relative">
            <Bell size={24} className="cursor-pointer hover:opacity-80" />
            {reminders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-emerald-600">
                {reminders.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {view === 'dashboard' && (
          <Dashboard 
            clients={clients} 
            onViewList={() => setView('list')} 
            onAddClient={() => setView('add')}
            onSelectClient={handleDetails}
          />
        )}
        
        {view === 'list' && (
          <div className="p-4 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Meus Clientes</h2>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nome ou telefone..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ClientList 
              clients={filteredClients} 
              onSelectClient={handleDetails} 
            />
          </div>
        )}

        {view === 'add' && (
          <ClientForm 
            onSave={addClient} 
            onCancel={() => setView('dashboard')} 
          />
        )}

        {view === 'edit' && selectedClient && (
          <ClientForm 
            client={selectedClient} 
            onSave={updateClient} 
            onCancel={() => setView('details')} 
          />
        )}

        {view === 'details' && selectedClient && (
          <ClientDetails 
            client={selectedClient} 
            onEdit={() => setView('edit')}
            onBack={() => setView('list')}
            onDelete={() => deleteClient(selectedClient.id)}
            onUpdate={updateClient}
          />
        )}

        {view === 'guide' && (
          <GoogleSheetsGuide onBack={() => setView('dashboard')} />
        )}
      </main>

      {/* Persistent Bottom Nav (Mobile/Web Responsive) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${view === 'dashboard' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          onClick={() => setView('list')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${view === 'list' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Users size={24} />
          <span className="text-xs mt-1">Clientes</span>
        </button>
        <button 
          onClick={() => setView('add')}
          className="bg-emerald-600 text-white p-3 rounded-full -mt-10 border-4 border-gray-100 shadow-lg transform active:scale-95 transition-transform"
        >
          <PlusCircle size={32} />
        </button>
        <button 
          onClick={() => setView('guide')}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${view === 'guide' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <BookOpen size={24} />
          <span className="text-xs mt-1">Guia</span>
        </button>
        <button 
          className="flex flex-col items-center p-2 rounded-xl text-gray-400 opacity-50 cursor-not-allowed"
          disabled
        >
          <LogOut size={24} />
          <span className="text-xs mt-1">Sair</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
