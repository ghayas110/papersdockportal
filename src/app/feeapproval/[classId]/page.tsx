"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, message, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

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

interface StudentFeesProps {
  params: {
    classId: string;
  };
}

const FeeApprovalPage: React.FC<StudentFeesProps> = ({ params }) => {
  const [feeData, setFeeData] = useState<FeeData[]>([]);
  const [filteredData, setFilteredData] = useState<FeeData[]>([]);
  const [isViewInvoiceVisible, setIsViewInvoiceVisible] = useState(false);
  const [selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('8'); // Default to August
  const [selectedYear, setSelectedYear] = useState<string>('2024'); // Default to 2024
  const router = useRouter();

  const classId = params.classId;
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    fetchFeeData();
  }, [selectedMonth, selectedYear]);

  const fetchFeeData = async () => {
    try {
      const response = await fetch(
        `http://be.papersdock.com/fees/get-all-fee-invoices-by-month-name?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            'accesstoken': `Bearer ${accessToken}`,
            'x-api-key': 'lms_API',
          },
        }
      );
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        const formattedData = data.data
          .filter((fee: any) => fee.selected_course === classId)
          .map((fee: any, index: number) => ({
            id: fee.fee_id || index.toString(),
            sno: index + 1,
            studentId: fee.student_id.toString(),
            studentName: fee.name,
            month: fee.month,
            year: fee.year,
            contact: fee.contact,
            status: fee.fee_status.toLowerCase() as 'unpaid' | 'paid' | 'waiting approval' | 'approved' | 'rejected',
            invoiceFile: fee.invoice_file ? `http://be.papersdock.com${fee.invoice_file}` : undefined,
          }));
        setFeeData(formattedData);
        setFilteredData(formattedData);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch fee data', error);
      message.error('Failed to fetch fee data');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = feeData.filter((fee) =>
      fee.studentName.toLowerCase().includes(value.toLowerCase()) ||
      fee.studentId.includes(value)
    );
    setFilteredData(filtered);
  };

  const handleStatusChange = async (id: string, value: string) => {
    try {
      const response = await fetch('http://be.papersdock.com/fees/approve-fee-invoice', {
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
        setFeeData(
          feeData.map((fee) =>
            fee.id === id ? { ...fee, status: value as 'unpaid' | 'paid' | 'waiting approval' | 'approved' | 'rejected' } : fee
          )
        );
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
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
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
        <div className="flex justify-between">
          <ArrowLeftOutlined onClick={() => router.back()} className="cursor-pointer" />
          <h1 className="text-3xl font-bold mb-8">Fee Approval</h1>
          <p>.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input.Search
            placeholder="Search by Student Name or ID"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchTerm}
            style={{ width: 300 }}
          />
          <Select
            defaultValue={selectedMonth}
            style={{ width: 120 }}
            onChange={(value) => setSelectedMonth(value)}
          >
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((month) => (
              <Select.Option key={month} value={month}>
                {month}
              </Select.Option>
            ))}
          </Select>
          <Select
            defaultValue={selectedYear}
            style={{ width: 120 }}
            onChange={(value) => setSelectedYear(value)}
          >
            {['2022', '2023', '2024', '2025'].map((year) => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Table columns={columns} dataSource={filteredData} rowKey="id" />

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
