"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Button, message } from "antd";
import StripeCheckout from "react-stripe-checkout";
import Invoice from "../fees/Invoice";
const Contact: React.FC = (): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paybool,setpaybool]=useState(false)
  const [product, setproduct] = useState({
    "price": 0,
    "name": '',
    "email": ''
  })
  const onToken = async (token: any) => {
    if(product.name!=''&&product.email!=''&&product.price!=0){
      if(product.price<5){
        alert("please enter minimum $5.")
      }
      else{
    try {
      const response = await axios.post('https://be.papersdock.com/checkout', { token, product });
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
  }
}
  else{
    alert("please fill all fields.")
  }
  };

  const handlePrint = () => {
    setpaybool(true)
    const printContents = invoiceRef.current?.innerHTML;
    const isMobileOrIpad = /Mobi|iPad/i.test(navigator.userAgent);
    const target = isMobileOrIpad ? '_self' : '_blank';
    if (printContents) {
      const printWindow = window.open('', target);
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
      setpaybool(false)
    }
  };

  const accordionData: Array<{ title: string; content: React.ReactNode }> = [
    {
      title: "Refund Policy",
      content: (
        <div className="mb-4">
          We&apos;re committed to your satisfaction. While we don&apos;t offer
          cash refunds, we&apos;re happy to exchange products if there&apos;s an
          issue. For example, if you receive the wrong size, we&apos;ll
          happily exchange it for the correct one. If you encounter a problem with
          your order, such as incorrect size or damaged items, please immediately
          inspect your package upon delivery. If there&apos;s an issue, capture
          clear photos of the problem and message us at our whatsapp number right
          away. Don&apos;t accept the package if it&apos;s significantly
          damaged or missing items. We&apos;ll work with you to find a suitable
          solution, which may include a replacement or exchange.
        </div>
      ),
    },
    {
      title: "How to Contact Us?",
      content: (
        <div className="flex flex-col space-y-2">
          <p>
            We&apos;re here to help! You can reach us through the following
            methods:
          </p>
          <ul className="list-disc pl-4">
            <li className="text-gray-700">WhatsApp: 0314-8008083</li>
            <li className="text-gray-700">Email: abc@gmail.com</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Do You Deliver All Over Pakistan?",
      content: (
        <div className="mb-4">
          We currently offer delivery services within Karachi, Pakistan. However,
          we are excited to announce that we are actively working on expanding
          our delivery network to other cities across Pakistan. Stay tuned for
          updates on our progress!
        </div>
      ),
    },
  ];

  const [isOpen, setIsOpen] = useState(-1);

  const toggle = (index: number) => {
    setIsOpen(isOpen === index ? -1 : index);
  };

  return (
    <>
      <div className=" p-10 " id="contact">
        <h1 className="text-4xl text-white font-bold text-center mb-8">Get in Touch</h1>
        <p className="text-xl text-center text-white mb-10">
          Have any questions or need assistance? Reach out to us through your
          preferred channel:
        </p>
        <div className="flex flex-col items-center">
          <div className="flex items-center p-4 border rounded-md shadow-md hover:shadow-lg text-white">
            <Image className="w-8 h-8 mr-4" src="/images/cover/whatsapp.png" alt="WhatsApp us" width={36} height={36} />
            <div className="flex-grow">
              <span className="text-lg text-white font-semibold">WhatsApp us at:</span>
              <a
                href="https://wa.me/12345678911"
                className="text-white ml-1 hover:underline"
              >
               +92 318 2248934
              </a>
            </div>
          </div>
          <input type="text" placeholder="Enter name"  onChange={(e) => setproduct({ ...product, name: e.target.value })} />
          <input type="email" placeholder="Enter email"  onChange={(e) => setproduct({ ...product, email: e.target.value })} />
          <input type="number" placeholder="Enter amount in usd"  onChange={(e) => setproduct({ ...product, price: parseInt(e.target.value) })} />
          <div className="flex items-center p-4 border rounded-md shadow-md hover:shadow-lg mt-10 text-white">
            <div className="flex-grow">
              <span className="text-lg text-white font-semibold">Intenational</span>
              <StripeCheckout
              key="stripe"
              amount={product.price*100} // Assuming the amount is in cents
              name={product.name}
              email={product.email}
              stripeKey="pk_live_51MFHJKIWbzOPJLuU3S9gFAxEocJH5X0ynjFszA0LAvvHaUccB9lL5SZ8e2dKd7ZhPGYWuH98xUJcLkp3btITy9U700e0S20Hco"
              token={onToken}
              locale="auto"
            />,
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
        </div>
        {paymentSuccess && invoiceData && (
          <div ref={invoiceRef}>
            <Invoice
              amount={invoiceData.amount*100}
              email={invoiceData.email}
              name={invoiceData.name}
              date={invoiceData.date}
              invoiceNumber={invoiceData.invoiceNumber}
            />
          </div>
        )}
      </div>

      {/* <div className=" bg-zinc-800">
        <h1 className="font-bold text-center text-2xl text-white bg-zinc-800 pt-9 mb-10">
          Frequently Asked Questions
        </h1>
        {accordionData.map((item, index) => (
          <div key={item.title} className="border-b border-gray-200 text-white">
            <button
              onClick={() => toggle(index)}
              className="flex items-center justify-between w-full p-4 focus:outline-none"
            >
              <span>{item.title}</span>
              <svg
                className={`w-4 h-4 transition transform duration-300 ${
                  index === isOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 1.414L10 10.586l3.293 3.293a1 1 0 11-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {index === isOpen && (
              <div className="p-4 bg-gray-100">{item.content}</div>
            )}
          </div>
        ))}
      </div> */}
    </>
  );
};

export default Contact;