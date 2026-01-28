
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
  BookOpen,
  Zap
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

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setClients(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentReminders = clients.filter(c => {
        if (!c.returnDateTime) return false;
        const returnTime = new Date(c.returnDateTime);
        const diff = returnTime.getTime() - now.getTime();
        return Math.abs(diff) < 1000 * 60 * 5 && c.status !== 'Contatado';
      });
      setReminders(currentReminders);
    }, 30000);
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
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Notifications bar */}
      {reminders.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-100 p-2.5 text-center animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-center gap-2 text-amber-800 font-semibold text-sm">
            <Bell size={16} className="text-amber-500 animate-bounce" />
            Retorno agora: <span className="font-bold underline cursor-pointer" onClick={() => handleDetails(reminders[0])}>{reminders[0].name}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="glass sticky top-0 z-30 border-b border-slate-200/60 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
            {/* Fix: Added missing Zap icon */}
            <Zap size={22} className="text-white fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">EcoCRM</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Smart Sales</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setView('guide')} 
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <BookOpen size={18} />
            Guia
          </button>
          <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>
          <div className="relative p-2 text-slate-500 hover:text-brand-600 cursor-pointer transition-colors">
            <Bell size={22} />
            {reminders.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {view === 'dashboard' && (
          <Dashboard 
            clients={clients} 
            onViewList={() => setView('list')} 
            onAddClient={() => setView('add')}
            onSelectClient={handleDetails}
          />
        )}
        
        {view === 'list' && (
          <div className="p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pipeline</h2>
                <p className="text-sm text-slate-500 font-medium">Gerencie sua carteira de leads</p>
              </div>
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar leads..." 
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
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

        {view === 'add' || (view === 'edit' && selectedClient) ? (
          <ClientForm 
            client={view === 'edit' ? selectedClient! : undefined} 
            onSave={view === 'edit' ? updateClient : addClient} 
            onCancel={() => setView(view === 'edit' ? 'details' : 'dashboard')} 
          />
        ) : null}

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

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass border border-slate-200/80 rounded-2xl px-2 py-2 flex justify-between items-center shadow-2xl shadow-slate-200/50 z-40">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-1 flex-col items-center gap-1 py-2 rounded-xl transition-all ${view === 'dashboard' ? 'text-brand-600 bg-brand-50/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <LayoutDashboard size={20} className={view === 'dashboard' ? 'fill-brand-100' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
        </button>
        <button 
          onClick={() => setView('list')}
          className={`flex flex-1 flex-col items-center gap-1 py-2 rounded-xl transition-all ${view === 'list' ? 'text-brand-600 bg-brand-50/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Users size={20} className={view === 'list' ? 'fill-brand-100' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Leads</span>
        </button>
        
        <div className="flex-none px-2">
          <button 
            onClick={() => setView('add')}
            className="bg-brand-600 text-white p-4 rounded-xl shadow-lg shadow-brand-200 active:scale-90 transition-transform hover:bg-brand-700"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        <button 
          onClick={() => setView('guide')}
          className={`flex flex-1 flex-col items-center gap-1 py-2 rounded-xl transition-all ${view === 'guide' ? 'text-brand-600 bg-brand-50/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BookOpen size={20} className={view === 'guide' ? 'fill-brand-100' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Apoio</span>
        </button>
        <button 
          disabled
          className="flex flex-1 flex-col items-center gap-1 py-2 rounded-xl text-slate-300 cursor-not-allowed"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Sair</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
