"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Tag, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import Invoice from './Invoice';

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
  const user = JSON.parse(localStorage.getItem('user_data') || '{}');
  console.log(user, "user")
  const [feeData, setFeeData] = useState<FeeData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeData | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const invoiceRef = useRef<HTMLDivElement>(null)
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    fetchFeeData();
  }, [selectedFee]);
  const [product, setproduct] = useState({
    "price": user.selected_course === "Both" ? 3200 : 1600,
    "name": `${user?.name}`,
    "email": `${user?.email}`
  })

  const fetchFeeData = async () => {
    try {
      const response = await fetch('http://be.papersdock.com/fees/get-all-fee-august-to-may', {
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

        const response = await fetch('http://be.papersdock.com/fees/insert-fee-invoice', {
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
      const response = await axios.post('http://be.papersdock.com/checkout', { token, product });
      if (response.status === 200) {
        const invoiceNumber = `INV-${Date.now()}`; // Generate a unique invoice number
        const date = new Date().toLocaleDateString(); // Current date

        setInvoiceData({
          amount: product.price,
          email: product.email,
          name: product.name,
          date,
          invoiceNumber,
        });

        message.success('Payment successful!');
        setPaymentSuccess(true);
      } else {
        message.error('Payment failed, please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Payment failed, please try again.');
    }
  };

  const handlePrint = () => {
    const printContents = invoiceRef.current?.innerHTML;

    if (printContents) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .invoice-container { padding: 20px; border: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="invoice-container">${printContents}</div>
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.focus();
      printWindow?.print();
      printWindow?.close();
      setPaymentSuccess(false)
      setInvoiceData(null)
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
          <a href={`http://be.papersdock.com${record.invoice_file}`} target="_blank" rel="noopener noreferrer">
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
              key="stripe"
              amount={product.price} // Assuming the amount is in cents
              name={product.name}
              email={product.email}
              stripeKey="pk_test_51MFHJKIWbzOPJLuUmaW6piuJIOkyZaCP7YXBMEnntHjQzZqpPoxeKYSVm7KgK5bRdx36WwXqDaqbth5b9DN1MgT600WCyfteSZ"
              token={onToken}
              locale="auto"
            />,
            paymentSuccess && (
              <Button
                key="print"
                type="primary"
                onClick={handlePrint}
                style={{ backgroundColor: 'black', borderColor: 'black' }}
              >
                Download Invoice
              </Button>
            ),
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
                  <a href={`http://be.papersdock.com${selectedFee.invoice_file}`} target="_blank" rel="noopener noreferrer">
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
        {paymentSuccess && invoiceData && (
          <div ref={invoiceRef}>
            <Invoice
              amount={invoiceData.amount}
              email={invoiceData.email}
              name={invoiceData.name}
              date={invoiceData.date}
              invoiceNumber={invoiceData.invoiceNumber}
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default StudentFeePage;
