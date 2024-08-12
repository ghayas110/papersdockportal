"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';

interface StudentData {
  id: string;
  sno: number;
  studentId: string;
  studentName: string;
  access: 'granted' | 'removed';
}

interface StudentApprovalPageProps {
  params: {
    course_type: string;
  };
}

const StudentApprovalPage: React.FC<StudentApprovalPageProps> = ({ params }) => {
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const accessToken = localStorage.getItem('access_token');
  const courseType = params.course_type
  useEffect(() => {
    fetchStudents();
  }, [courseType]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('https://lms.papersdock.com/users/get-all-users', {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      if (response.ok) {
        const filteredData = data.data
          .filter((user: any) => user.user_type === 'student' && user.selected_course === courseType)
          .map((user: any, index: number) => ({
            id: user.id.toString(),
            sno: index + 1,
            studentId: user.id.toString(),
            studentName: user.name,
            access: 'removed', // Default access status; adjust as necessary based on your data
          }));
        setStudentData(filteredData);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch students', error);
      message.error('Failed to fetch students');
    }
  };

  const handleAccessChange = async (id: string, access: 'granted' | 'removed') => {
    const apiUrl = access === 'granted' 
      ? 'https://lms.papersdock.com/users/approve-student-access' 
      : 'https://lms.papersdock.com/users/reject-student-access';

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
        setStudentData(studentData.map(student => {
          if (student.id === id) {
            return { ...student, access };
          }
          return student;
        }));
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error(`Failed to ${access === 'granted' ? 'grant' : 'remove'} access`, error);
      message.error(`Failed to ${access === 'granted' ? 'grant' : 'remove'} access`);
    }
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
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
      title: 'Action',
      key: 'action',
      render: (text: string, record: StudentData) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleAccessChange(record.id, 'granted')}
          
            style={{
              backgroundColor: "rgb(28, 36, 52)"
            
            }}
          >
            Give Access
          </Button>
          <Button
            type="primary"
            onClick={() => handleAccessChange(record.id, 'removed')}
           
            style={{
              backgroundColor: "rgb(28, 36, 52)"
            
            }}
          >
            Remove Access
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Student Approval</h1>
        <Table columns={columns} dataSource={studentData} rowKey="id" />
      </div>
    </DefaultLayout>
  );
};

export default StudentApprovalPage;
