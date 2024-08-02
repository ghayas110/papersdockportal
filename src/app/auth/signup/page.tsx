"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Select, message, Upload, Button, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const { Option } = Select;



const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (info: any) => {
    if (info.file.status === 'done') {
      setFile(info.file.originFileObj);
    }
  };

  const handleSubmit = async (values: any) => {
    if (values.password !== values.retypePassword) {
      message.error("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("selected_course", values.selectedCourse);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("https://lms.papersdock.com/users/create-user", {
        method: "POST",
        headers: {
          "x-api-key": "lms_API",
        },
        body: formData,
      });

      const data = await response.json();
      if (data.message === "User added successfully") {
        message.success("User added successfully!");
      } else {
        message.error("Error: " + data.message);
      }
    } catch (error) {
      message.error("An error occurred. Please try again later.");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block bg-black dark:bg-transparent" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo1.png"}
                  alt="Logo"
                  width={176}
                  height={10}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo1.png"}
                  alt="Logo"
                  width={176}
                  height={10}
                />
              </Link>
              <p className="xl:px-10">Get Professional Services For Best Future</p>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium"></span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign Up to PapersDock
              </h2>

              <Form form={form} onFinish={handleSubmit}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please enter your password' }]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item
                  name="retypePassword"
                  label="Re-type Password"
                  rules={[{ required: true, message: 'Please re-enter your password' }]}
                >
                  <Input.Password placeholder="Re-enter your password" />
                </Form.Item>

                <Form.Item
                  name="selectedCourse"
                  label="Course"
                  rules={[{ required: true, message: 'Please select your course' }]}
                >
                  <Select placeholder="Select your course">
                    <Option value="AS">AS</Option>
                    <Option value="A2">A2</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Upload File">
                  <Upload
                    name="file"
                    beforeUpload={() => false} // Prevent automatic upload
                    onChange={handleFileChange}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Button  htmlType="submit">
                    Create account
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignUp;
