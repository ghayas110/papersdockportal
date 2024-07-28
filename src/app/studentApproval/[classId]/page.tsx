// pages/studentApproval.tsx
"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState } from 'react';
import { Table, Button, Space, message } from 'antd';

interface StudentData {
  id: string;
  sno: number;
  studentId: string;
  studentName: string;
  access: 'granted' | 'removed';
}

const initialStudentData: StudentData[] = [
  { id: '1', sno: 1, studentId: 'student1', studentName: 'John Doe', access: 'removed' },
  { id: '2', sno: 2, studentId: 'student2', studentName: 'Jane Smith', access: 'granted' },
  // Add more student records as needed
];

const StudentApprovalPage: React.FC = () => {
  const [studentData, setStudentData] = useState(initialStudentData);

  const handleAccessChange = (id: string, access: 'granted' | 'removed') => {
    const updatedData = studentData.map(student => {
      if (student.id === id) {
        return { ...student, access };
      }
      return student;
    });
    setStudentData(updatedData);
    message.success(`Access ${access === 'granted' ? 'granted to' : 'removed from'} the student.`);
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
            disabled={record.access === 'granted'}
            style={{
              backgroundColor: record.access === 'removed' ? 'whitesmoke' : 'rgb(28, 36, 52)',
              borderColor: record.access === 'removed' ? 'whitesmoke' : 'rgb(28, 36, 52)',
              color: record.access === 'removed' ? 'black' : 'white',
            }}
          >
            Give Access
          </Button>
          <Button
            type="primary"
            onClick={() => handleAccessChange(record.id, 'removed')}
            disabled={record.access === 'removed'}
            style={{
              backgroundColor: record.access === 'granted' ? 'whitesmoke' : 'rgb(28, 36, 52)',
              borderColor: record.access === 'granted' ? 'whitesmoke' : 'rgb(28, 36, 52)',
              color: record.access === 'granted' ? 'black' : 'white',
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
