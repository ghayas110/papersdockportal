"use client"; // Mark this file as a Client Component

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect } from 'react';
import { Table, Button, Upload, Tag, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Assignment {
  id: string;
  assignment_id: string;
  courseId: string;
  courseName: string;
  assignmentName: string;
  questionFile: string;
  deadline: string;
  obtainedMarks?: number;
  status?: string;
  assignment_file: string;
  submission_id: string | null;
}

interface AssignmentUploadPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const AssignmentUploadPage: React.FC<AssignmentUploadPageProps> = ({ params }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userData = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data') || '{}') : null;

  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`https://lms.papersdock.com/assignments/get-all-assignments`, {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
console.log(data)
      if (response.ok) {
        const filteredAssignments = data.data.filter((assignment: any) => assignment.course_type === userData.selected_course);
        const fetchedAssignments = filteredAssignments.map((assignment: any) => ({
          id: assignment.assignment_id,
          assignment_id: assignment.assignment_id,
          courseId: assignment.course_type,
          courseName: assignment.course_type,
          assignmentName: assignment.assignment_name,
          questionFile: `https://lms.papersdock.com${assignment.assignment_file}`,
          deadline: moment(assignment.deadline).format('YYYY-MM-DD'),
          obtainedMarks: assignment.obtained_marks,
          status: assignment.status,
          assignment_file: assignment.assignment_file,
          submission_id: assignment.submission_id,
        }));
        setAssignments(fetchedAssignments);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch assignments', error);
      message.error('Failed to fetch assignments');
    }
  };

  const handleFileChange = (assignmentId: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [assignmentId]: file }));
    if (file) {
      setFileNames((prev) => ({ ...prev, [assignmentId]: file.name }));
    }
  };

  const handleFileUpload = async (assignmentId: string) => {
    const uploadedFile = uploadedFiles[assignmentId];
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('assignment_id', assignmentId);
      formData.append('submitAssignment', uploadedFile);

      try {
        const response = await fetch('https://lms.papersdock.com/submission/submit-assignment', {
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
          setUploadedFiles((prev) => ({ ...prev, [assignmentId]: null }));
          setFileNames((prev) => ({ ...prev, [assignmentId]: '' }));
          fetchAssignments();
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error('Failed to submit assignment', error);
        message.error('Failed to submit assignment');
      }
    }
  };

  const handleViewAssignment = (fileUrl: string) => {
    setPdfUrl(`https://lms.papersdock.com${fileUrl}`);
    setIsModalOpen(true);
  };

  const columns = (courseId: string) => [
    {
      title: 'AssignmentId',
      dataIndex: 'id',
      key: 'id',
    },
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
      render: (text: string, record: Assignment) => (
        <Tag color={record.status === 'Submitted' ? 'green' : 'blue'}>{record.status}</Tag>
      ),
    },
    {
      title: 'Uploaded File',
      key: 'uploadedFile',
      render: (text: string, record: Assignment) => (
        record.submission_id ? (
          <Button onClick={() => handleViewAssignment(record.assignment_file)} style={{ color: 'white', backgroundColor: 'black' }}>
            View Assignment
          </Button>
        ) : (
          fileNames[record.id] ? fileNames[record.id] : 'No file uploaded'
        )
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
          disabled={!!record.submission_id}
        >
          <Button icon={<UploadOutlined />} style={{ color: 'white', backgroundColor: 'black' }} disabled={!!record.submission_id}>
            Select File
          </Button>
        </Upload>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Assignment) => (
        <Button
          onClick={() => handleFileUpload(record.id)}
          disabled={!uploadedFiles[record.id] || !!record.submission_id}
          style={{ color: 'white', backgroundColor: 'black' }}
        >
          Submit
        </Button>
      ),
    },
    {
      title: 'Obtained Marks',
      key: 'obtainedMarks',
      render: (text: string, record: Assignment) => (
        record.obtainedMarks !== undefined ? record.obtainedMarks : 'Not yet graded'
      ),
    },
  ];

  const groupedAssignments = assignments.reduce((acc, assignment) => {
    (acc[assignment.courseId] = acc[assignment.courseId] || []).push(assignment);
    return acc;
  }, {} as { [key: string]: Assignment[] });

  return (
    <DefaultLayout>
     
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

      <Modal
        title="View Assignment"
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        width="80%"
        className="custom-modal"
        style={{ zIndex: 100000000000 }}
      >
        {pdfUrl && (
          <iframe src={pdfUrl} style={{ width: '100%', height: '600px' }} />
        )}
      </Modal>
    </DefaultLayout>
  );
};

export default AssignmentUploadPage;
