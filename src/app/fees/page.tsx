"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState } from 'react';
import { Table, Button, Modal, Tag } from 'antd';

interface FeeData {
  id: string;
  sno: number;
  month: string;
  year: string;
  status: 'unpaid' | 'paid' | 'waiting approval';
  courseId: string;
  courseName: string;
  amount: number;
}

const feeData: FeeData[] = [
  { id: '1', sno: 1, month: 'January', year: '2024', status: 'unpaid', courseId: 'math101', courseName: 'Mathematics', amount: 100 },
  { id: '2', sno: 2, month: 'February', year: '2024', status: 'paid', courseId: 'phys101', courseName: 'Physics', amount: 120 },
  // Add more fee records as needed
];

const getStatusTag = (status: 'unpaid' | 'paid' | 'waiting approval') => {
  switch (status) {
    case 'unpaid':
      return <Tag color="red" style={{ borderRadius: '8px' }}>Unpaid</Tag>;
    case 'paid':
      return <Tag color="green" style={{ borderRadius: '8px' }}>Paid</Tag>;
    case 'waiting approval':
      return <Tag color="orange" style={{ borderRadius: '8px' }}>Waiting Approval</Tag>;
    default:
      return null;
  }
};

const StudentFeePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeData | null>(null);

  const showModal = (fee: FeeData) => {
    setSelectedFee(fee);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Handle the payment logic here
    if (selectedFee) {
      console.log(`Payment made for ${selectedFee.month} ${selectedFee.year}`);
      // Update fee status to 'waiting approval'
      feeData.forEach(fee => {
        if (fee.id === selectedFee.id) {
          fee.status = 'waiting approval';
        }
      });
      // Update state to reflect the change
      setSelectedFee({ ...selectedFee, status: 'waiting approval' });
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: FeeData) => getStatusTag(record.status),
    },
    {
      title: 'Course ID',
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: FeeData) => (
        <Button 
          type="primary" 
          onClick={() => showModal(record)} 
          disabled={record.status === 'paid' || record.status === 'waiting approval'}
          style={{ 
            backgroundColor: record.status === 'unpaid' ? 'whitesmoke' : 'rgb(28, 36, 52)', 
            borderColor: record.status === 'unpaid' ? 'whitesmoke' : 'rgb(28, 36, 52)',
            color: record.status === 'unpaid' ? 'black' : 'white',
          }}
        >
          Pay
        </Button>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <Table columns={columns} dataSource={feeData} rowKey="id" />
        <Modal 
          title="Fee Payment" 
          visible={isModalVisible} 
          onOk={handleOk} 
          onCancel={handleCancel}
          footer={[
            <Button 
              key="pay" 
              type="primary" 
              onClick={handleOk} 
              style={{ backgroundColor: 'black', borderColor: 'black' }}
            >
              Pay
            </Button>,
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          {selectedFee && (
            <>
              <p>Course: {selectedFee.courseName}</p>
              <p>Month: {selectedFee.month}</p>
              <p>Year: {selectedFee.year}</p>
              <p>Amount: ${selectedFee.amount}</p>
              <p>Description: Fees for {selectedFee.month} {selectedFee.year} for the course {selectedFee.courseName}</p>
            </>
          )}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default StudentFeePage;
