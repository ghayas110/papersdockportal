"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Button, message, Modal } from "antd";
import StripeCheckout from "react-stripe-checkout";
import Invoice from "../fees/Invoice";

const Contact: React.FC = (): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [product, setProduct] = useState({
    price: 0,
    name: '',
    email: '',
  });

  const onToken = async (token: any) => {
    if (product.name !== '' && product.email !== '' && product.price !== 0) {
      if (product.price < 5) {
        alert("Please enter a minimum of $5.");
      } else {
        try {
          const response = await axios.post('https://be.papersdock.com/checkout', { token, product });
          if (response.status === 200) {
            const invoiceNumber = `INV-${Date.now()}`; // Generate a unique invoice number
            const date = new Date().toLocaleDateString(); // Current date

            setInvoiceData({
              amount: product.price*100,
              email: product.email,
              name: product.name,
              date,
              invoiceNumber,
            });

            message.success("Payment successful!");
            setPaymentSuccess(true);
            setIsModalVisible(false); // Close the modal upon payment success
          } else {
            message.error("Payment failed, please try again.");
          }
        } catch (error) {
          console.error("Payment error:", error);
          message.error("Payment failed, please try again.");
        }
      }
    } else {
      alert("Please fill all fields.");
    }
  };

  const handlePrint = () => {
    const printContents = invoiceRef.current?.innerHTML;
    if (printContents) {
      const printWindow = window.open("", "_blank");
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
    }
  };

  return (
    <>
      <div className="p-10" id="contact">
        <h1 className="text-4xl text-white font-bold text-center mb-8">Get in Touch</h1>
        <p className="text-xl text-center text-white mb-10">
          Have any questions or need assistance? Reach out to us through your preferred channel:
        </p>
        <div className="flex flex-col items-center">
          <div className="flex items-center p-4 border rounded-md shadow-md hover:shadow-lg text-white">
            <Image className="w-8 h-8 mr-4" src="/images/cover/whatsapp.png" alt="WhatsApp us" width={36} height={36} />
            <div className="flex-grow">
              <span className="text-lg text-white font-semibold">WhatsApp us at:</span>
              <a
                href="https://wa.me/923182248934"
                className="text-white ml-1 hover:underline"
              >
                +92 318 2248934
              </a>
            </div>
          </div>
          <div className="flex items-center p-4 border rounded-md shadow-md hover:shadow-lg mt-10 text-white">
            <div className="flex-grow">
              <span className="text-lg text-white font-semibold">Intenational</span>
              <Button style={{backgroundColor:"black",color:'white' ,marginLeft:30}} onClick={() => setIsModalVisible(true)}>
            Proceed to Payment
          </Button>
          { paymentSuccess && (
              <Button
                key="print"
                type="primary"
                onClick={handlePrint}
                style={{ backgroundColor: 'black', borderColor: 'black' }}
              >
                Download Invoice
              </Button>
            )}
            </div>
          </div>
      
          {/* Proceed to Payment Button */}
       
        </div>

        {/* Ant Design Modal */}
        <Modal
          title="Payment Information"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <input
            type="text"
            placeholder="Enter name"
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="mb-3 w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            placeholder="Enter email"
            onChange={(e) => setProduct({ ...product, email: e.target.value })}
            className="mb-3 w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Enter amount in USD"
            onChange={(e) => setProduct({ ...product, price: parseInt(e.target.value) })}
            className="mb-3 w-full p-2 border border-gray-300 rounded-md"
          />

          {/* Stripe Checkout button */}
          <StripeCheckout
            key="stripe"
            amount={product.price * 100} // Amount in cents
            name={product.name}
            email={product.email}
            stripeKey="pk_test_51MFHJKIWbzOPJLuUmaW6piuJIOkyZaCP7YXBMEnntHjQzZqpPoxeKYSVm7KgK5bRdx36WwXqDaqbth5b9DN1MgT600WCyfteSZ"
            token={onToken}
            locale="auto"
          />
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
            <Button onClick={handlePrint} className="mt-4" type="primary">
              Download Invoice
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Contact;
