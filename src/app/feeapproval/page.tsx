// pages/feeApproval.tsx
"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState } from 'react';
import { Table, Button, Modal, Tag, Select, message } from 'antd';

interface FeeData {
  id: string;
  sno: number;
  studentId: string;
  studentName: string;
  status: 'unpaid' | 'paid' | 'waiting approval' | 'approved' | 'rejected';
  invoiceFile?: File;
}

const initialFeeData: FeeData[] = [
  { id: '1', sno: 1, studentId: 'student1', studentName: 'John Doe', status: 'waiting approval', invoiceFile: new File([""], "invoice1.pdf") },
  { id: '2', sno: 2, studentId: 'student2', studentName: 'Jane Smith', status: 'paid', invoiceFile: new File([""], "invoice2.pdf") },
  // Add more fee records as needed
];

const getStatusTag = (status: 'unpaid' | 'paid' | 'waiting approval' | 'approved' | 'rejected') => {
  switch (status) {
    case 'unpaid':
      return <Tag color="red" style={{ borderRadius: '8px' }}>Unpaid</Tag>;
    case 'paid':
      return <Tag color="green" style={{ borderRadius: '8px' }}>Paid</Tag>;
    case 'waiting approval':
      return <Tag color="orange" style={{ borderRadius: '8px' }}>Waiting Approval</Tag>;
    case 'approved':
      return <Tag color="blue" style={{ borderRadius: '8px' }}>Approved</Tag>;
    case 'rejected':
      return <Tag color="gray" style={{ borderRadius: '8px' }}>Rejected</Tag>;
    default:
      return null;
  }
};

const FeeApprovalPage: React.FC = () => {
  const [feeData, setFeeData] = useState(initialFeeData);
  const [isViewInvoiceVisible, setIsViewInvoiceVisible] = useState(false);
  const [selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);

  const handleStatusChange = (id: string, value: string) => {
    const updatedData = feeData.map(fee => {
      if (fee.id === id) {
        return { ...fee, status: value as 'unpaid' | 'paid' | 'waiting approval' | 'approved' | 'rejected' };
      }
      return fee;
    });
    setFeeData(updatedData);
    message.success(`Fee status updated to ${value}`);
  };

  const handleViewInvoice = (file: File) => {
    if (file) {
      const fileUrl = "https://marketplace.canva.com/EAETpJ0lmjg/2/0/1131w/canva-fashion-invoice-zvoLwRH8Wys.jpg"
      setSelectedInvoiceUrl(fileUrl);
      setIsViewInvoiceVisible(true);
    } else {
      message.error('No invoice available to view.');
    }
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Fee Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: FeeData) => (
        <Select
          defaultValue={record.status}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Select.Option value="unpaid">Unpaid</Select.Option>
          <Select.Option value="paid">Paid</Select.Option>
          <Select.Option value="waiting approval">Waiting Approval</Select.Option>
          <Select.Option value="approved">Approved</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: FeeData) => (
        <Button type="link" onClick={() => handleViewInvoice(record.invoiceFile!)}>
          View Invoice
        </Button>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Fee Approval</h1>
        <Table columns={columns} dataSource={feeData} rowKey="id" />
        
        {/* View Invoice Modal */}
        <Modal
          title="View Invoice"
          visible={isViewInvoiceVisible}
          footer={null}
          onCancel={() => setIsViewInvoiceVisible(false)}
        >
          {selectedInvoiceUrl && <iframe src={selectedInvoiceUrl} style={{ width: '100%', height: '500px' }} />}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default FeeApprovalPage;
