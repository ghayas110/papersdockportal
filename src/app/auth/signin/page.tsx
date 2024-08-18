"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import axios from "axios"
import StripeCheckout, { Token } from "react-stripe-checkout";
import Image from "next/image";


const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [product, setproduct] = useState({
    "price": 1000,
    "name": "adsada",
     "email":"ghayas110@gmail.com"
  })

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

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const response = await fetch("https://lms.papersdock.com/users/login-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "lms_API",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log(data)
      setLoading(false);

      if (data.message === "successfully login") {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_data", JSON.stringify(data.data));
        message.success("Successfully logged in!");
        if (data?.data?.user_type === "admin") {
          router.push("/Dashboard");
        } else {
          router.push("/lectures");
        }

      } else {
        message.error(data.message || "Login failed!");
      }
    } catch (error) {
      setLoading(false);
      message.error("An error occurred. Please try again later.");
    }
  };

  return (
    <>

     
     
<div className="rounded-sm border border-stroke bg-white shadow-default h-screen dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center justify-center h-screen">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center justify-center ">
            <Link className="mb-5.5 inline-block bg-black dark:bg-transparent" href="/">
               
                <Image
                
                  src={"/images/logo/logo1.png"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>

            
            
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to PapersDock
              </h2>

              <Form onFinish={handleSubmit}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: "email", message: "Please enter your email" }]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please enter your password" }]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item>
                  <Button htmlType="submit" loading={loading}>
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
