"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

interface FeeData {
  fee_id: number | null;
  month: string;
  year: number;
  invoice_file: string | null;
  fee_status: 'Approved' | 'Pending';
  fee_expiry_date: string | null;
  approved_by: number | null;
  created_at: string | null;
  updated_at: string | null;
}

const getStatusTag = (status: 'Approved' | 'Pending') => {
  switch (status) {
    case 'Pending':
      return <Tag color="orange" style={{ borderRadius: '8px' }}>Pending</Tag>;
    case 'Approved':
      return <Tag color="green" style={{ borderRadius: '8px' }}>Approved</Tag>;
    default:
      return null;
  }
};

const StudentFeePage: React.FC = () => {
  const [feeData, setFeeData] = useState<FeeData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeData | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    fetchFeeData();
  }, [selectedFee]);
  const [product, setproduct] = useState({
    "price": 1000,
    "name": "adsada",
     "email":"ghayas110@gmail.com"
  })

  const fetchFeeData = async () => {
    try {
      const response = await fetch('https://lms.papersdock.com/fees/get-all-fee-august-to-may', {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();

      if (response.ok && data.data) {
        setFeeData(data.data);
      } else {
        message.error(data.message || 'Failed to fetch fee data');
      }
    } catch (error) {
      console.error('Failed to fetch fee data', error);
      message.error('Failed to fetch fee data');
    }
  };

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
        formData.append('year', selectedFee.year.toString());
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
          setIsModalVisible(false); // Close the modal after submission
          setSelectedFee(null); // Clear selected fee
          setFeeData([])
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
  const onToken = async (token: any) => {
    try {
      console.log(token, "SADasdasdasda")
      const response = await axios.post(`https://lms.papersdock.com/checkout`, { token, product });
      console.log(response, "sdadasdasdad");
      message.success("Payment successful!");
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Payment failed, please try again.");
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedFee(null);
    setFileList([]);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const columns = [
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
      dataIndex: 'fee_status',
      key: 'fee_status',
      render: (text: string, record: FeeData) => getStatusTag(record.fee_status),
    },
    {
      title: 'Invoice',
      key: 'invoice_file',
      render: (text: string, record: FeeData) =>
        record.invoice_file ? (
          <a href={`https://lms.papersdock.com${record.invoice_file}`} target="_blank" rel="noopener noreferrer">
            View Invoice
          </a>
        ) : (
          'No Invoice'
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: FeeData) => (
        <Button
          type="primary"
          onClick={() => showModal(record)}
          disabled={record.fee_status === 'Approved'}
          style={{
            backgroundColor: record.fee_status === 'Pending' ? 'black' : 'rgb(28, 36, 52)',
            borderColor: record.fee_status === 'Pending' ? 'black' : 'rgb(28, 36, 52)',
            color: 'white',
          }}
        >
          Submit Invoice
        </Button>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <Table columns={columns} dataSource={feeData} rowKey="fee_id" />
        <Modal
          title="Submit Fee Invoice"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <StripeCheckout
        amount={product.price} // Assuming the amount is in cents
        name={product.name}
        email={product.email}
        stripeKey="pk_test_51MFHJKIWbzOPJLuUmaW6piuJIOkyZaCP7YXBMEnntHjQzZqpPoxeKYSVm7KgK5bRdx36WwXqDaqbth5b9DN1MgT600WCyfteSZ"
        token={onToken}
        locale="auto"
      />,
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              style={{ backgroundColor: 'black', borderColor: 'black' }}
            >
              Submit
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
              {selectedFee.invoice_file ? (
                <p>
                  Existing Invoice:{' '}
                  <a href={`https://lms.papersdock.com${selectedFee.invoice_file}`} target="_blank" rel="noopener noreferrer">
                    View Invoice
                  </a>
                </p>
              ) : (
                <p>No Invoice Uploaded</p>
              )}
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                fileList={fileList}
              >
                <Button icon={<UploadOutlined />}>Upload New Invoice</Button>
              </Upload>
            </>
          )}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default StudentFeePage;
