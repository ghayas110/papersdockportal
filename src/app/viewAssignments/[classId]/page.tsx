"use client";
import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Upload, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

interface StudentAssignment {
  studentId: string;
  studentName: string;
  answerFile?: File;
  questionFile?: File;
  assignmentId: string;
  assignmentName: string;
}

const initialStudentAssignments: StudentAssignment[] = [
  {
    studentId: 'student1',
    studentName: 'John Doe',
    assignmentId: 'assignment1',
    assignmentName: 'Assignment 1: Introduction',
  },
  {
    studentId: 'student2',
    studentName: 'Jane Smith',
    assignmentId: 'assignment2',
    assignmentName: 'Assignment 2: Advanced Topics',
  },
  // Add more assignments as needed
];

interface CoursePageProps {
  params: {
    classId: string;
    courseId: string;
  };
}

const ViewAssignments: React.FC<CoursePageProps> = ({ params }) => {
  const router = useRouter();
  const courseId = params.courseId;
  const classId = params.classId;
  const [studentAssignments, setStudentAssignments] = useState(initialStudentAssignments);
  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleViewAssignment = (assignment: StudentAssignment, type: 'answer' | 'question') => {
    const file = type === 'answer' ? assignment.answerFile : assignment.questionFile;
    if (file) {
      setFileUrl(URL.createObjectURL(file));
      setViewModalVisible(true);
    } else {
      message.error('No file available to view.');
    }
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
      title: 'Assignment ID',
      dataIndex: 'assignmentId',
      key: 'assignmentId',
    },
    {
      title: 'Assignment Name',
      dataIndex: 'assignmentName',
      key: 'assignmentName',
    },
    {
      title: 'View Answer File',
      key: 'answerFile',
      render: (text: string, record: StudentAssignment) => (
        <Button type="link" onClick={() => handleViewAssignment(record, 'answer')}>View Answer</Button>
      ),
    },
    {
      title: 'View Question File',
      key: 'questionFile',
      render: (text: string, record: StudentAssignment) => (
        <Button type="link" onClick={() => handleViewAssignment(record, 'question')}>View Question</Button>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Class {classId} - Course {courseId} - View Assignments</h1>
        <Table columns={columns} dataSource={studentAssignments} rowKey="assignmentId" />

        {/* View Assignment Modal */}
        <Modal
          title="View Assignment"
          visible={isViewModalVisible}
          footer={null}
          onCancel={() => setViewModalVisible(false)}
        >
          {fileUrl && <iframe src={fileUrl} style={{ width: '100%', height: '500px' }} />}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default ViewAssignments;
