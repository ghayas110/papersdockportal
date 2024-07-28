"use client"; // Mark this file as a Client Component

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState } from 'react';
import { Table, Button, Upload, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  assignmentName: string;
  questionFile: string;
  deadline: string;
}

interface AssignmentUploadPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const AssignmentUploadPage: React.FC<AssignmentUploadPageProps> = ({ params }) => {
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});
  const [status, setStatus] = useState<{ [key: string]: string }>({});
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});

  const assignments: Assignment[] = [
    {
      id: '1',
      courseId: 'math101',
      courseName: 'Mathematics',
      assignmentName: 'Assignment 1: Algebra',
      questionFile: 'https://example.com/questions1.pdf',
      deadline: '2024-08-15',
    },
    {
      id: '2',
      courseId: 'math101',
      courseName: 'Mathematics',
      assignmentName: 'Assignment 2: Geometry',
      questionFile: 'https://example.com/questions2.pdf',
      deadline: '2024-08-20',
    },
    {
      id: '3',
      courseId: 'phys101',
      courseName: 'Physics',
      assignmentName: 'Assignment 1: Mechanics',
      questionFile: 'https://example.com/questions3.pdf',
      deadline: '2024-08-25',
    },
    // Add more assignments as needed
  ];

  const handleFileChange = (assignmentId: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [assignmentId]: file }));
    if (file) {
      setFileNames((prev) => ({ ...prev, [assignmentId]: file.name }));
    }
  };

  const handleFileUpload = (assignmentId: string) => {
    const uploadedFile = uploadedFiles[assignmentId];
    if (uploadedFile) {
      console.log('File uploaded for assignment', assignmentId, ':', uploadedFile);
      setStatus((prev) => ({ ...prev, [assignmentId]: 'submitted' }));
      setUploadedFiles((prev) => ({ ...prev, [assignmentId]: null }));
    }
  };

  const renderStatus = (assignmentId: string, deadline: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (status[assignmentId] === 'marked') {
      return <Tag color="yellow">Marked</Tag>;
    }
    if (status[assignmentId] === 'submitted') {
      return <Tag color="green">Submitted</Tag>;
    }
    if (currentDate > deadline) {
      return <Tag color="red">Not Submitted</Tag>;
    }
    return <Tag color="blue">Pending</Tag>;
  };

  const groupedAssignments = assignments.reduce((acc, assignment) => {
    (acc[assignment.courseId] = acc[assignment.courseId] || []).push(assignment);
    return acc;
  }, {} as { [key: string]: Assignment[] });

  const columns = (courseId: string) => [
    {
      title: 'Assignment Name',
      dataIndex: 'assignmentName',
      key: 'assignmentName',
    },
    {
      title: 'Question File',
      key: 'questionFile',
      render: (text: string, record: Assignment) => (
        <a href={record.questionFile} download className="text-blue-500 underline">
          Download
        </a>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Status',
      key: 'status',
      render: (text: string, record: Assignment) => renderStatus(record.id, record.deadline),
    },
    {
      title: 'Uploaded File',
      key: 'uploadedFile',
      render: (text: string, record: Assignment) => (
        fileNames[record.id] ? fileNames[record.id] : 'No file uploaded'
      ),
    },
    {
      title: 'Upload',
      key: 'upload',
      render: (text: string, record: Assignment) => (
        <Upload
          beforeUpload={(file) => {
            handleFileChange(record.id, file);
            return false;
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Assignment) => (
        <Button
          type="primary"
          onClick={() => handleFileUpload(record.id)}
          disabled={!uploadedFiles[record.id]}
          style={{ marginTop: '8px' }}
        >
          Submit
        </Button>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Assignments" course="Assignments" />
      <div className="container mx-auto p-8">
        {Object.keys(groupedAssignments).map((courseId) => (
          <div key={courseId} className="mb-8 w-full">
            <h2 className="text-2xl font-bold mb-4">
              Course: {groupedAssignments[courseId][0].courseName}
            </h2>
            <Table
              columns={columns(courseId)}
              dataSource={groupedAssignments[courseId]}
              rowKey="id"
              pagination={false}
            />
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default AssignmentUploadPage;
