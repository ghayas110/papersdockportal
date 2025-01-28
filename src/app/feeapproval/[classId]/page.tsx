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
  contact: string;
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
  const [selectedMonth, setSelectedMonth] = useState<string>('8'); // Default August
  const [selectedYear, setSelectedYear] = useState<string>('2024'); // Default 2024
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Status filter
  const router = useRouter();

  const accessToken = localStorage.getItem('access_token');
  const classId = ['P2_Crash_Course', 'P4_Crash_Course', 'Crash_Composite'].includes(params.classId)
    ? params.classId.replace(/_/g, ' ')
    : params.classId;

  const months = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];

  const years = ['2022', '2023', '2024', '2025'];

  useEffect(() => {
    fetchFeeData();
  }, [selectedMonth, selectedYear, selectedStatus]);

  const fetchFeeData = async () => {
    try {
      const response = await fetch(
        `https://be.papersdock.com/fees/get-all-fee-invoices-by-month-name?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            'accesstoken': `Bearer ${accessToken}`,
            'x-api-key': 'lms_API',
          },
        }
      );
      const data = await response.json();
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
            invoiceFile: fee.invoice_file ? `https://be.papersdock.com${fee.invoice_file}` : undefined,
          }));

        setFeeData(formattedData);
        applyFilters(formattedData, searchTerm, selectedStatus);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch fee data', error);
      message.error('Failed to fetch fee data');
    }
  };

  const applyFilters = (data: FeeData[], search: string, status: string) => {
    const filtered = data.filter(
      (fee) =>
        (search ? fee.studentName.toLowerCase().includes(search.toLowerCase()) || fee.studentId.includes(search) : true) &&
        (status ? fee.status === status : true)
    );
    setFilteredData(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(feeData, value, selectedStatus);
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    applyFilters(feeData, searchTerm, value);
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
    { title: 'S.No', dataIndex: 'sno', key: 'sno' },
    { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Student Name', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Contact', dataIndex: 'contact', key: 'contact' },
    { title: 'Fee Status', dataIndex: 'status', key: 'status' },
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
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input.Search
            placeholder="Search by Student Name or ID"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchTerm}
            style={{ width: 300 }}
          />

          <Select value={selectedMonth} style={{ width: 150 }} onChange={(value) => { setSelectedMonth(value); }}>
            {months.map((month) => <Select.Option key={month.value} value={month.value}>{month.label}</Select.Option>)}
          </Select>

          <Select value={selectedYear} style={{ width: 120 }} onChange={(value) => { setSelectedYear(value); }}>
            {years.map((year) => <Select.Option key={year} value={year}>{year}</Select.Option>)}
          </Select>

          <Select placeholder="Filter by Status" value={selectedStatus} style={{ width: 200 }} onChange={handleStatusFilter} allowClear>
          <Select.Option value="not paid">Unpaid</Select.Option>
            <Select.Option value="pending">Paid</Select.Option>

            <Select.Option value="approved">Approved</Select.Option>
          
          </Select>
        </div>

        <Table columns={columns} dataSource={filteredData} rowKey="id" />

        {/* View Invoice Modal */}
        <Modal title="View Invoice" open={isViewInvoiceVisible} footer={null} onCancel={() => setIsViewInvoiceVisible(false)}>
          {selectedInvoiceUrl && <iframe src={selectedInvoiceUrl} style={{ width: '100%', height: '500px' }} />}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default FeeApprovalPage;
