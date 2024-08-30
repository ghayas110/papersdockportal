"use client"; // Mark this file as a Client Component

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, message, Modal } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRouter } from 'next/navigation';
interface Assignment {
  submission_id: string | null;
  assignment_id: string;
  student_name: string;
  assignment_name: string;
  questionFile: string;
  assignment_file: string;
  deadline: string;
  course_type: string;
  obtained_marks: string | null;
}

interface ViewAssignmentsProps {
  params: {
    classId: string;
  };
}

const ViewAssignments: React.FC<ViewAssignmentsProps> = ({ params }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [obtainedMarks, setObtainedMarks] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const accessToken = localStorage.getItem('access_token');

  const router = useRouter();
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`https://www.be.papersdock.com/assignments/get-all-assignments`, {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      if (response.ok) {
        const filteredAssignments = params.classId!='Both'?data.data.filter((assignment: any) => assignment.course_type == params.classId):data.data;
        console.log(filteredAssignments,)
        const fetchedAssignments = filteredAssignments.map((assignment: any) => ({
          submission_id: assignment.submission_id,
          student_id: assignment.student_id,
          assignment_id: assignment.assignment_id,
          student_name: assignment.student_name,
          assignment_name: assignment.assignment_name,
          questionFile: `https://www.be.papersdock.com${assignment.assignment_file}`,
          assignment_file: assignment.submission_file,
          deadline: moment(assignment.deadline).format('YYYY-MM-DD'),
          course_type: assignment.course_type,
          contact: assignment.contact,
          obtained_marks: assignment.obtained_marks,
        }));
        setAssignments(fetchedAssignments);
        setFilteredAssignments(fetchedAssignments);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch assignments', error);
      message.error('Failed to fetch assignments');
    }
  };

  const handleMarksChange = (submissionId: string, value: string) => {
    setObtainedMarks((prev) => ({ ...prev, [submissionId]: value }));
  };

  const handleMarksSubmit = async (submissionId: string) => {
    const marks = parseInt(obtainedMarks[submissionId]);
    if (marks) {
      try {
        const response = await fetch('https://www.be.papersdock.com/submission/check-assignment', {
          method: 'POST',
          headers: {
            'accesstoken': `Bearer ${accessToken}`,
            'x-api-key': 'lms_API',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ submission_id: submissionId.toString(), obtained_marks: marks }),
        });
        const data = await response.json();
        if (response.ok) {
          message.success(data.message);
          fetchAssignments();
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error('Failed to submit marks', error);
        message.error('Failed to submit marks');
      }
    }
  };

  const handleViewAssignment = (fileUrl: string) => {
    setPdfUrl(`https://www.be.papersdock.com${fileUrl}`);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = assignments.filter(
      (assignment) =>
        assignment.student_name.toLowerCase().includes(value.toLowerCase()) ||
        assignment.assignment_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAssignments(filtered);
  };

  const columns = [
    {
      title: 'Submission ID',
      dataIndex: 'submission_id',
      key: 'submission_id',
    },
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Assignment Name',
      dataIndex: 'assignment_name',
      key: 'assignment_name',
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
      title: 'Assignment File',
      key: 'assignment_file',
      render: (text: string, record: Assignment) =>
        record.assignment_file ? (
          <Button
            onClick={() => handleViewAssignment(record.assignment_file)}
            style={{ color: 'white', backgroundColor: 'black' }}
          >
            View Assignment
          </Button>
        ) : (
          'No file uploaded'
        ),
    },
    {
      title: 'Obtained Marks',
      key: 'obtained_marks',
      render: (text: string, record: Assignment) => (
        <Input
          value={obtainedMarks[record.submission_id || ''] ?? (record.obtained_marks !== 'Not yet Graded' ? record.obtained_marks : '')}
          onChange={(e) => handleMarksChange(record.submission_id || '', e.target.value)}
          placeholder="Enter marks"
          style={{ width: '100px' }}
          disabled={record.obtained_marks != ''}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Assignment) => (
        <Button
          onClick={() => handleMarksSubmit(record.submission_id || '')}
         
          style={{ color: 'white', backgroundColor: 'black' }}
          disabled={record.obtained_marks != ''}
        >
          Submit
        </Button>
      ),
    },
  ];

  const groupedAssignments = filteredAssignments.reduce((groups: { [key: string]: Assignment[] }, assignment: Assignment) => {
    const { assignment_id } = assignment;
    if (!groups[assignment_id]) {
      groups[assignment_id] = [];
    }
    groups[assignment_id].push(assignment);
    return groups;
  }, {});

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
      <div className="flex justify-between">
          <ArrowLeftOutlined onClick={() => router.back()} className="cursor-pointer" />
          <h1 className="text-3xl font-bold mb-8">View Assignments</h1>
          <Input.Search
          placeholder="Search by Student Name or Assignment Name"
          onChange={(e) => handleSearch(e.target.value)}
          value={searchTerm}
          style={{ marginBottom: '20px', width: '300px' }}
        />
        </div>
     
        {Object.keys(groupedAssignments).map((assignmentId) => (
          <div key={assignmentId} style={{ marginBottom: '30px' }}>
            <h2 className="text-2xl font-bold mb-4">Assignment ID: {assignmentId}</h2>
            <Table
              columns={columns}
              dataSource={groupedAssignments[assignmentId]}
              rowKey="submission_id"
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
        {pdfUrl && <iframe src={pdfUrl} style={{ width: '100%', height: '600px' }} />}
      </Modal>
    </DefaultLayout>
  );
};

export default ViewAssignments;
