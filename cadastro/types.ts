
export interface Client {
  id: string;
  name: string;
  phone: string;
  hasWhatsApp: boolean;
  billValue: number;
  isLowBill: boolean;
  isLowIncomeProgram: boolean;
  returnDateTime: string;
  notes: string;
  status: 'Novo' | 'Contatado' | 'Fechado' | 'Perdido';
  createdAt: string;
}

export type View = 'dashboard' | 'list' | 'add' | 'edit' | 'details' | 'guide';
