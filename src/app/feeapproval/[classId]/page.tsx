"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, Select, message } from 'antd';

interface FeeData {
  id: string;
  sno: number;
  studentId: string;
  month: string;
  year: string;
  studentName: string;
  status: 'unpaid' | 'paid' | 'waiting approval' | 'approved' | 'rejected';
  invoiceFile?: string;
}

const FeeApprovalPage: React.FC = () => {
  const [feeData, setFeeData] = useState<FeeData[]>([]);
  const [isViewInvoiceVisible, setIsViewInvoiceVisible] = useState(false);
  const [selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);

  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      const response = await fetch('https://lms.papersdock.com/fees/get-all-fee-invoice', {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        const formattedData = data.data.map((fee: any, index: number) => ({
          id: fee.fee_id || index.toString(),
          sno: index + 1,
          studentId: fee.student_id.toString(),
          studentName: fee.name,
          month: fee.month,
          year: fee.year,
          status: fee.fee_status.toLowerCase() as 'unpaid' | 'paid' | 'waiting approval' | 'approved' | 'rejected',
          invoiceFile: fee.invoice_file ? `https://lms.papersdock.com${fee.invoice_file}` : undefined,
        }));
        setFeeData(formattedData);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch fee data', error);
      message.error('Failed to fetch fee data');
    }
  };

  const handleStatusChange = async (id: string, value: string) => {
    try {
      const response = await fetch('https://lms.papersdock.com/fees/approve-fee-invoice', {
        method: 'POST',
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fee_id: id, fee_status: value }),
      });
      const data = await response.json();
      if (response.ok) {
        setFeeData(feeData.map(fee => fee.id === id ? { ...fee, status: value as 'unpaid' | 'paid' | 'waiting approval' | 'approved' | 'rejected' } : fee));
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to update fee status', error);
      message.error('Failed to update fee status');
    }
  };

  const handleViewInvoice = (fileUrl?: string) => {
    if (fileUrl) {
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
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
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
        <Button type="link" onClick={() => handleViewInvoice(record.invoiceFile)}>
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
          open={isViewInvoiceVisible}
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
