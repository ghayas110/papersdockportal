"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface FeeData {
  id: string;
  sno: number;
  month: string;
  year: string;
  status: 'unpaid' | 'paid' | 'waiting approval';
  amount: number;
  invoiceFile?: File;
}

const getCurrentMonthYear = () => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear().toString();
  return { month, year };
};

const initialFeeData: FeeData[] = [
  { id: '1', sno: 1, ...getCurrentMonthYear(), status: 'unpaid', amount: 100 },
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
  const [feeData, setFeeData] = useState(initialFeeData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeData | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const accessToken = localStorage.getItem('access_token');
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

  useEffect(() => {
    if (userData.is_fee_paid_flag === 'Y') {
      const updatedData = feeData.map(fee => ({ ...fee, status: 'paid' }));
      setFeeData(updatedData);
    }
  }, [userData]);

  const showModal = (fee: FeeData) => {
    setSelectedFee(fee);
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (selectedFee && fileList.length > 0) {
      try {
        const formData = new FormData();
        formData.append('month', selectedFee.month);
        formData.append('year', selectedFee.year);
        formData.append('invoice', fileList[0].originFileObj);

        const response = await fetch('https://lms.papersdock.com/fees/insert-fee-invoice', {
          method: 'POST',
          headers: {
            'accesstoken': `Bearer ${accessToken}`,
            'x-api-key': 'lms_API',
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          message.success('Payment submitted and awaiting approval');
          const updatedData = feeData.map(fee =>
            fee.id === selectedFee.id ? { ...fee, status: 'waiting approval' } : fee
          );
          setFeeData(updatedData);
          setIsModalVisible(false);
        } else {
          message.error(data.message || 'Failed to submit payment');
        }
      } catch (error) {
        console.error('Payment submission failed:', error);
        message.error('Failed to submit payment');
      }
    } else {
      message.error('Please upload an invoice file!');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
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
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => `$${text.toFixed(2)}`,
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
            backgroundColor: record.status === 'unpaid' ? 'black' : 'rgb(28, 36, 52)',
            borderColor: record.status === 'unpaid' ? 'black' : 'rgb(28, 36, 52)',
            color: 'white',
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
              <p>Month: {selectedFee.month}</p>
              <p>Year: {selectedFee.year}</p>
              <p>Amount: ${selectedFee.amount}</p>
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                fileList={fileList}
              >
                <Button icon={<UploadOutlined />}>Click to Upload Invoice</Button>
              </Upload>
            </>
          )}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default StudentFeePage;
