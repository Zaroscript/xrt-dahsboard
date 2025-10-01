import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  responses: Array<{
    id: string;
    message: string;
    isAdmin: boolean;
    timestamp: string;
    adminName?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  details?: string;
}

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  description: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  userAddress?: UserAddress;
  items?: InvoiceItem[];
  subtotal?: number;
  taxAmount?: number;
  taxRate?: number;
  discountAmount?: number;
  notes?: string;
}

interface SupportState {
  tickets: SupportTicket[];
  invoices: Invoice[];
  selectedTicket: SupportTicket | null;
  selectedInvoice: Invoice | null;
  loading: boolean;
  filter: 'all' | 'open' | 'in_progress' | 'resolved' | 'closed';
}

const initialState: SupportState = {
  tickets: [],
  invoices: [],
  selectedTicket: null,
  selectedInvoice: null,
  loading: false,
  filter: 'all',
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<SupportTicket[]>) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action: PayloadAction<SupportTicket>) => {
      state.tickets.push(action.payload);
    },
    updateTicket: (state, action: PayloadAction<SupportTicket>) => {
      const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    },
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload;
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.push(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.invoices.findIndex(invoice => invoice.id === action.payload.id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    setSelectedTicket: (state, action: PayloadAction<SupportTicket | null>) => {
      state.selectedTicket = action.payload;
    },
    setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.selectedInvoice = action.payload;
    },
    setFilter: (state, action: PayloadAction<SupportState['filter']>) => {
      state.filter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { 
  setTickets, 
  addTicket, 
  updateTicket, 
  setInvoices, 
  addInvoice, 
  updateInvoice, 
  setSelectedTicket, 
  setSelectedInvoice, 
  setFilter, 
  setLoading 
} = supportSlice.actions;
export default supportSlice.reducer;