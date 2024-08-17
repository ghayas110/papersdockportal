import React from 'react';

interface InvoiceProps {
    amount: number;
    email: string;
    name: string;
    date: string;
    invoiceNumber: string;
}

const Invoice: React.FC<InvoiceProps> = ({ amount, email, name, date, invoiceNumber }) => {
    return (
        <div id="invoice" style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1 style={{ textAlign: 'center' }}>Invoice</h1>
            <p><strong>Invoice Number:</strong> {invoiceNumber}</p>
            <p><strong>Date:</strong> {date}</p>
            <hr />
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <hr />
            <p><strong>Amount Paid:</strong> ${amount / 100}</p>
            <hr />
            <p style={{ textAlign: 'center' }}>Thank you for your payment!</p>
        </div>
    );
};

export default Invoice;
