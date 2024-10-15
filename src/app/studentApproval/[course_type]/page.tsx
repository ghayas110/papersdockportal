"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button, Space, message, Input, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Search } = Input;

interface StudentData {
  id: string;
  sno: number;
  studentId: string;
  studentName: string;
  access: 'granted' | 'removed';
  approved_by_admin_flag: string;
}

interface StudentApprovalPageProps {
  params: {
    course_type: string;
  };
}

const StudentApprovalPage: React.FC<StudentApprovalPageProps> = ({ params }) => {
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [filteredData, setFilteredData] = useState<StudentData[]>([]);
  const accessToken = localStorage.getItem('access_token');
  const router = useRouter();
  const courseType = params.course_type;

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

      if (response.ok) {
        const filteredData = data.data
          .filter((user: any) => user.user_type === 'student' && user.selected_course === courseType)
          .map((user: any, index: number) => ({
            id: user.id.toString(),
            sno: index + 1,
            studentId: user.id.toString(),
            studentName: user.name,
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
    </DefaultLayout>
  );
};

export default StudentApprovalPage;
