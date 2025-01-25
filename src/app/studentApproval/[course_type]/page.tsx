"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, Select, message, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Contact from '@/app/Contact/page';
import { select } from 'framer-motion/client';
import { emitWarning } from 'process';

const { Search } = Input;

interface StudentData {
  id: string;
  studentId: string;
  studentName: string;
  access: 'granted' | 'removed';
  approved_by_admin_flag: string;
  email: string;
  contact: string;
  selectedcourse: string;
  
}

interface StudentApprovalPageProps {
  params: {
    course_type: string;
  };
}

const StudentApprovalPage: React.FC<StudentApprovalPageProps> = ({ params }) => {
  const [form] = Form.useForm();
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [filteredData, setFilteredData] = useState<StudentData[]>([]);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const accessToken = localStorage.getItem('access_token');
  const router = useRouter();

  if(params.course_type == 'P2_Crash_Course' || params.course_type == 'P4_Crash_Course' || params.course_type == 'Crash_Composite'){
    var courseType = (params.course_type).replace(/_/g, ' ');
  }else{
    var courseType = params.course_type
  }
  console.log(courseType,"courseType")
// console.log(courseType,"courseType")
  useEffect(() => {
    fetchStudents();
  }, [courseType]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('https://be.papersdock.com/users/get-all-users', {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
console.log(data)
      if (response.ok) {
        const filteredData = data.data
          .filter((user: any) => user.user_type === 'student' && user.selected_course === courseType)
          .map((user: any, index: number) => ({
            id: user.id.toString(),
            sno: index + 1,
            studentId: user.id.toString(),
            studentName: user.name,
            contact: user.contact,
            email: user.email,
            selectedcourse: user.selected_course,
            access: 'removed',
            approved_by_admin_flag: user.approved_by_admin_flag,
          }));
        setStudentData(filteredData);
        setFilteredData(filteredData);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch students', error);
      message.error('Failed to fetch students');
    }
  };

  const handleSearch = (value: string) => {
    const searchTerm = value.toLowerCase();
    const filtered = studentData.filter(
      (student) =>
        student.studentName.toLowerCase().includes(searchTerm) ||
        student.studentId.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  const handleAccessChange = async (id: string, access: 'granted' | 'removed') => {
    const apiUrl =
      access === 'granted'
        ? 'https://be.papersdock.com/users/approve-student-access'
        : 'https://be.papersdock.com/users/reject-student-access';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok) {
        setStudentData((prevData) =>
          prevData.map((student) =>
            student.id === id ? { ...student, access } : student
          )
        );
        setFilteredData((prevData) =>
          prevData.map((student) =>
            student.id === id ? { ...student, access } : student
          )
        );
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error(`Failed to ${access === 'granted' ? 'grant' : 'remove'} access`, error);
      message.error(`Failed to ${access === 'granted' ? 'grant' : 'remove'} access`);
    }
};
  const handleConfirmEdit = async (record: StudentData) => {

       setIsEditLoading(true);
       try {
        const apiUrl ='https://be.papersdock.com/users/update-user-profile'
       
        const values = await form.validateFields();
        console.log(values?.selectedcourse,"sss")
        const formData = new FormData();
        formData.append('id', (record.id).toString());
        formData.append('name', values.studentName);
        formData.append('selected_course', values.selectedcourse);
        formData.append('email', values.email);
        formData.append('contact', values.contact);
        formData.append('password', '');
      
         const response = await fetch(apiUrl, {
           method: 'POST',
           headers: {
             'accesstoken': `Bearer ${accessToken}`,
             'x-api-key': 'lms_API',
           },
           body: formData,
         });
 
         const data = await response.json();
         if (response.ok) {
           message.success(data.message);
           setIsEditLoading(false);
           setEditModalOpen(false);
           fetchStudents();
         } else {
           message.error(data.message);
         }
       } catch (error) {
         console.error('Failed to update user', error);
       }
    // try {
    //   const response = await fetch(apiUrl, {
    //     method: 'POST',
    //     headers: {
    //       'accesstoken': `Bearer ${accessToken}`,
    //       'x-api-key': 'lms_API',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ id }),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     setStudentData((prevData) =>
    //       prevData.map((student) =>
    //         student.id === id ? { ...student, access } : student
    //       )
    //     );
    //     setFilteredData((prevData) =>
    //       prevData.map((student) =>
    //         student.id === id ? { ...student, access } : student
    //       )
    //     );
    //     message.success(data.message);
    //   } else {
    //     message.error(data.message);
    //   }
    // } catch (error) {
    //   console.error(`Failed to ${access === 'granted' ? 'grant' : 'remove'} access`, error);
    //   message.error(`Failed to ${access === 'granted' ? 'grant' : 'remove'} access`);
    // }
  };


  const handleDeleteUser = async (record: StudentData) => {
    try {
      const response = await fetch('https://be.papersdock.com/users/delete-student', {
        method: 'POST',
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: record.id }),
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        message.success(data.message);
        fetchStudents();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to delete user', error);
      message.error('Failed to delete user');
  }

  };
  const handleEditUser = (record: StudentData) => {
    setSelectedStudent(record);
    form.setFieldsValue({
    
      studentName: record.studentName,
      selectedcourse: record.selectedcourse,
      email: record.email,
      contact: record.contact,
    });
    setEditModalOpen(true);
  };
  const columns = [
  
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Student Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Student Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    // {
    //   title: 'Selected Course',
    
    //   key: 'selected_course',
    //   render: (text: string, record: StudentData) => (
    //     <span>{record.selectedcourse=="AS"?"AS":record.selectedcourse=="OS"?"A2":"Composite"}</span>
    //   ),

    // },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: StudentData) => (
        <Space size="middle">
          <Button
            disabled={record.approved_by_admin_flag === 'Y'}
            onClick={() => handleAccessChange(record.id, 'granted')}
          >
            Give Access
          </Button>
          <Button
            disabled={record.approved_by_admin_flag === 'N'}
            onClick={() => handleAccessChange(record.id, 'removed')}
          >
            Remove Access
          </Button>
        
          <Button
            
            onClick={() => handleEditUser(record)}
          >
           Edit User
          </Button>
          <Button

            onClick={() => handleDeleteUser(record)}
          >
           Delete User
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-4">
          <ArrowLeftOutlined onClick={() => router.back()} className="cursor-pointer" />
          <h1 className="text-3xl font-bold">Student Approval</h1>
          <div />
        </div>
        <Row gutter={[16, 16]} className="mb-4">
          <Col span={12}>
            <Search
              placeholder="Search by Student Name or ID"
              allowClear
              enterButton={
                <Button
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    border: 'none',
                    height: '40px',
                    lineHeight: '40px',
                  }}
                >
                  Search
                </Button>
              }
              size="large"
              onSearch={handleSearch}
            />
          </Col>
        </Row>
        <Table columns={columns} dataSource={filteredData} rowKey="id" />
      </div>
      <Modal
          title="Edit Note"
          open={isEditModalOpen}
          onOk={() => handleConfirmEdit(selectedStudent as StudentData)}
          onCancel={() => setEditModalOpen(false)}
          confirmLoading={isEditLoading}
          okButtonProps={{
            style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' },
            disabled: isEditLoading,
          }}
        >
          <Form form={form} layout="vertical" name="edit_note_form">
            <Form.Item
              name="studentName"
              label="Student Name"
              rules={[{ required: true, message: 'Please input the student name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please input the email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="contact"
              label="Contact"
              rules={[{ required: true, message: 'Please input the contact!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="selectedcourse"
              label="Selected Course"
              rules={[{ required: true, message: 'Please input the selected course!' }]}
            >
            <Select>
                <Select.Option value="AS">AS</Select.Option>
                <Select.Option value="OS">A2</Select.Option>
                <Select.Option value="Both">Composite</Select.Option>
                <Select.Option value="P2 Crash Course">P2 Crash Course</Select.Option>
                    <Select.Option value="P4 Crash Course">P4 Crash Course</Select.Option>
                    <Select.Option value="Crash Composite">Crash Composite</Select.Option>
              </Select>
            </Form.Item>
            {/* <Form.Item
              name="note_titl"
              label="Note Title"
              rules={[{ required: true, message: 'Please input the note title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="note_type"
              label="Note Type"
              rules={[{ required: true, message: 'Please select the note type!' }]}
            >
              <Select>
                <Select.Option value="dark_mode">Dark Mode</Select.Option>
                <Select.Option value="light_mode">Light Mode</Select.Option>
              </Select>
            </Form.Item> */}
          
        
          </Form>
        </Modal>
    </DefaultLayout>
  );
};

export default StudentApprovalPage;
