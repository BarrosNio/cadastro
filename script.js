// Gerenciamento de Estado do App
let clients = [];
const STORAGE_KEY = 'ecocrm_leads';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadClients();
    setupForm();
    startReminderLoop();
});

// Navegação entre Telas
function changeView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    
    // Atualiza botões da nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-emerald-600', 'bg-emerald-50/50');
        btn.classList.add('text-slate-400');
    });

    if(viewId === 'list') {
        renderClients();
        const listBtn = document.querySelector('button[onclick="changeView(\'list\')"]');
        if(listBtn) {
            listBtn.classList.add('text-emerald-600', 'bg-emerald-50/50');
            listBtn.classList.remove('text-slate-400');
        }
    }
}

// Persistência de Dados
function loadClients() {
    const data = localStorage.getItem(STORAGE_KEY);
    clients = data ? JSON.parse(data) : [];
    renderClients();
}

function saveClients() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    updateLeadCount();
}

function updateLeadCount() {
    const el = document.getElementById('lead-count');
    if(el) el.innerText = clients.length;
}

// Cadastro de Leads
function setupForm() {
    const form = document.getElementById('lead-form');
    if(!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newLead = {
            id: Date.now(),
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            hasWhatsApp: document.getElementById('hasWhatsApp').checked,
            billValue: parseFloat(document.getElementById('billValue').value) || 0,
            isLowBill: document.getElementById('isLowBill').checked,
            isLowIncome: document.getElementById('isLowIncome').checked,
            returnDateTime: document.getElementById('returnDateTime').value,
            notes: document.getElementById('notes').value,
            createdAt: new Date().toISOString(),
            notified: false
        };

        clients.unshift(newLead);
        saveClients();
        form.reset();
        changeView('list');
    });
}

// Renderização da Lista
function renderClients() {
    const container = document.getElementById('client-list-container');
    if(!container) return;
    updateLeadCount();
    
    if (clients.length === 0) {
        container.innerHTML = `
            <div class="py-20 text-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p>Nenhum cliente cadastrado ainda.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = clients.map(client => `
        <div class="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer" onclick="showDetails(${client.id})">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    ${client.name.charAt(0)}
                </div>
                <div>
                    <h4 class="font-bold text-slate-900 leading-tight">${client.name}</h4>
                    <p class="text-[10px] font-black uppercase text-slate-400 mt-1">
                        R$ ${client.billValue.toFixed(2)} • ${client.isLowIncome ? 'Baixa Renda' : 'Residencial'}
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                ${client.returnDateTime ? `
                    <div class="hidden sm:flex flex-col items-end">
                        <span class="text-[8px] font-black uppercase text-slate-300">Retorno em</span>
                        <span class="text-[10px] font-bold text-emerald-600">${new Date(client.returnDateTime).toLocaleDateString()}</span>
                    </div>
                ` : ''}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    `).join('');
}

// Detalhes do Lead
function showDetails(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    const detailsContainer = document.getElementById('details-content');
    if(!detailsContainer) return;

    detailsContainer.innerHTML = `
        <div class="flex items-center gap-4 mb-8">
            <button onclick="changeView('list')" class="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h2 class="text-2xl font-black text-slate-800">Detalhes do Lead</h2>
        </div>

        <div class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-6 animate-in fade-in zoom-in duration-300">
            <div class="bg-slate-900 p-8 text-center text-white relative">
                <div class="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-slate-800">
                    <span class="text-3xl font-black">${client.name.charAt(0)}</span>
                </div>
                <h3 class="text-2xl font-black">${client.name}</h3>
                <p class="text-emerald-400 text-sm font-bold mt-1">${client.phone}</p>
            </div>

            <div class="p-4 grid grid-cols-2 gap-3 bg-slate-50 border-b border-slate-100">
                <a href="tel:${client.phone}" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm active:scale-95 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Ligar</span>
                </a>
                <a href="${client.hasWhatsApp ? `https://wa.me/${client.phone.replace(/\D/g,'')}` : '#'}" target="_blank" class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm active:scale-95 transition-transform ${!client.hasWhatsApp ? 'opacity-30 cursor-not-allowed' : ''}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412s-1.239 6.164-3.485 8.41c-2.247 2.247-5.231 3.486-8.412 3.486-1.995 0-3.956-.503-5.694-1.458l-5.699 1.494c-.161.042-.321.063-.48.063-.585 0-1.097-.373-1.284-.92zm6.658-2.52l.36.213c1.408.835 3.033 1.275 4.7 1.275 5.044 0 9.148-4.105 9.151-9.148.001-2.446-.953-4.746-2.685-6.478-1.733-1.732-4.032-2.686-6.478-2.686-5.045 0-9.15 4.104-9.152 9.147-.001 1.764.509 3.492 1.474 4.997l.231.359-1.008 3.682 3.787-.993zm11.234-5.32c-.328-.164-1.944-.959-2.243-1.068-.3-.11-.518-.164-.737.164-.219.328-.847 1.068-1.038 1.286-.192.219-.383.246-.711.082-.328-.164-1.386-.511-2.641-1.63-1-.891-1.675-1.991-1.872-2.33-.197-.328-.021-.506.142-.67.147-.147.328-.383.492-.574.164-.192.219-.328.328-.547.11-.219.055-.411-.027-.574-.082-.164-.737-1.777-1.01-2.433-.267-.639-.539-.553-.737-.563-.191-.01-.411-.011-.63-.011s-.574.082-.875.411c-.301.328-1.148 1.123-1.148 2.738 0 1.615 1.176 3.175 1.341 3.394.164.219 2.314 3.533 5.605 4.959.783.339 1.393.542 1.87.693.786.25 1.503.215 2.068.13.632-.094 1.944-.794 2.217-1.56.274-.767.274-1.424.192-1.56-.082-.136-.301-.219-.63-.383z" />
                    </svg>
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Zap</span>
                </a>
            </div>

            <div class="p-8 space-y-6">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Perfil Financeiro</p>
                        <p class="text-lg font-black text-slate-900 leading-tight">R$ ${client.billValue.toFixed(2)}</p>
                        <div class="flex gap-2 mt-2">
                            ${client.isLowIncome ? '<span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-wider rounded border border-blue-100">Baixa Renda</span>' : ''}
                            ${client.isLowBill ? '<span class="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-wider rounded border border-amber-100">Conta Baixa</span>' : ''}
                        </div>
                    </div>
                </div>

                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Retorno Agendado</p>
                        <p class="font-bold text-slate-800 leading-tight">
                            ${client.returnDateTime ? new Date(client.returnDateTime).toLocaleString() : 'Não agendado'}
                        </p>
                    </div>
                </div>

                <div class="space-y-2">
                    <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Observações</p>
                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 italic leading-relaxed">
                        ${client.notes || 'Nenhuma observação.'}
                    </div>
                </div>
            </div>
        </div>

        <button onclick="deleteLead(${client.id})" class="w-full bg-white border border-rose-100 p-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-50 transition-all active:scale-[0.98]">
            Excluir Lead permanentemente
        </button>
    `;
    changeView('details');
}

// Ações
function deleteLead(id) {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
        clients = clients.filter(c => c.id !== id);
        saveClients();
        changeView('list');
    }
}

function clearStorage() {
    if (confirm('ATENÇÃO: Deseja apagar TODOS os leads cadastrados? Esta ação não pode ser desfeita.')) {
        clients = [];
        saveClients();
        renderClients();
        changeView('list');
    }
}

// Lembretes Automáticos
function startReminderLoop() {
    setInterval(() => {
        const now = new Date();
        clients.forEach(client => {
            if (client.returnDateTime && !client.notified) {
                const scheduledTime = new Date(client.returnDateTime);
                if (scheduledTime <= now) {
                    alert(`⏰ HORA DO RETORNO!\n\nCliente: ${client.name}\nTelefone: ${client.phone}\n\nAbra o EcoCRM para ver os detalhes.`);
                    client.notified = true;
                    saveClients();
                }
            }
        });
    }, 30000);
}