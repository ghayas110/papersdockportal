"use client";
import React, { useState } from "react";
import Image from "next/image";
const Contact: React.FC = (): JSX.Element => {
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
      <div className=" p-10  bg-zinc-800">
        <h1 className="text-4xl text-white font-bold text-center mb-8">Get in Touch</h1>
        <p className="text-xl text-center text-white mb-10">
          Have any questions or need assistance? Reach out to us through your
          preferred channel:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center p-4 border rounded-md shadow-md hover:shadow-lg text-white">
            <Image className="w-8 h-8 mr-4" src="/images/cover/whatsapp.png" alt="WhatsApp us" width={36} height={36} />
            <div className="flex-grow">
              <span className="text-lg text-white font-semibold">WhatsApp us at:</span>
              <a
                href="https://wa.me/12345678911"
                className="text-white ml-1 hover:underline"
              >
                0314-8008083
              </a>
            </div>
          </div>
          <div className="flex items-center p-4 border rounded-md shadow-md hover:shadow-lg text-white">
            <Image className="w-8 h-8 mr-4" src="/images/cover/facebook.png" alt="DM us on Instagram" width={36} height={36} />
            <div className="flex-grow">
              <span className="text-lg font-semibold">DM us on Faccebook:</span>
              <a
                href="https://www.instagram.com/shoeseys/"
                className="text-white ml-1 hover:underline"
              >
               PapersDock
              </a>
            </div>
          </div>
          <div className="flex items-center p-4 border rounded-md shadow-md hover:shadow-lg text-white">
            <Image className="w-8 h-8 mr-4" src="/images/cover/gmail.png" alt="Email us at" width={36} height={36} />
            <div className="flex-grow text-white">
              <span className="text-lg font-semibold text-white">Email us at:</span>
              <a
                href="mailto:abc@gmail.com"
                className="text-white ml-1 hover:underline"
              >
                papersdock@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className=" bg-zinc-800">
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
      </div>
    </>
  );
};

export default Contact;