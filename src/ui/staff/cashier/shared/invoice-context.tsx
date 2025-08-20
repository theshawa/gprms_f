import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CashierInvoice } from '@/interfaces/cashier-invoice';
import { sampleInvoices } from '../invoices/sample-data';

interface InvoiceContextType {
  invoices: CashierInvoice[];
  addInvoice: (invoice: CashierInvoice) => void;
  getNextInvoiceNumber: () => string;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

interface InvoiceProviderProps {
  children: ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [invoices, setInvoices] = useState<CashierInvoice[]>(sampleInvoices);

  const addInvoice = (invoice: CashierInvoice) => {
    setInvoices(prev => [...prev, invoice]);
  };

  const getNextInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();
    const existingInvoices = invoices.filter(inv => 
      inv.invoiceNumber.includes(currentYear.toString())
    );
    const nextNumber = existingInvoices.length + 1;
    return `#${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, getNextInvoiceNumber }}>
      {children}
    </InvoiceContext.Provider>
  );
};
