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
  const [asBool,setAsBool]=useState(false)
  const [osBool,setOsBool]=useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const accessToken = localStorage.getItem('access_token');


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    if (userData.selected_course) {
      setSelectedCourse(userData.selected_course);
      fetchAssignments();
    }
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
console.log(data)
      if (response.ok) {
        const filteredAssignments = data.data
        const fetchedAssignments = filteredAssignments.map((assignment: any) => ({
          id: assignment.assignment_id,
          assignment_id: assignment.assignment_id,
          courseId: assignment.course_type,
          courseName: assignment.course_type,
          assignmentName: assignment.assignment_name,
          questionFile: `https://www.be.papersdock.com${assignment.assignment_file}`,
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
        const response = await fetch('https://www.be.papersdock.com/submission/submit-assignment', {
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
    setPdfUrl(`https://www.be.papersdock.com${fileUrl}`);
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
     {selectedCourse == "Both"?
     <>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
            <div className={`cursor-pointer rounded-sm border border-stroke bg-${asBool?"muted":"white"} px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark`}  onClick={()=>{
          setAsBool(true)
          setOsBool(false)
        }}>
    

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  AS
                </h4>
            
              </div>
      
             
            </div>
          </div>
          <div className={`cursor-pointer rounded-sm border border-stroke bg-${osBool?"muted":"white"} px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark`}  onClick={()=>{
          setOsBool(true)
          setAsBool(false)
        }}>
    

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  A2
                </h4>
            
              </div>
      
             
            </div>
          </div>
        </div>
     </>:
     <>
      {Object.keys(groupedAssignments).map((courseId) => (
          <div key={courseId} className="mb-8 w-full">
         
            <Table
              columns={columns(courseId)}
              dataSource={groupedAssignments[courseId]}
              rowKey="id"
              pagination={false}
            />
          </div>
        ))}
     </>

     }
   
{
          asBool?
          <>
             {Object.keys(groupedAssignments).filter((courseType) => courseType === "AS").map((courseId) => (
          <div key={courseId} className="mb-8 w-full">
         
            <Table
              columns={columns(courseId)}
              dataSource={groupedAssignments[courseId]}
              rowKey="id"
              pagination={false}
            />
          </div>
        ))}
          </>:osBool?
          
          <>
             {Object.keys(groupedAssignments).filter((courseType) => courseType === "OS").map((courseId) => (
          <div key={courseId} className="mb-8 w-full">
          
            <Table
              columns={columns(courseId)}
              dataSource={groupedAssignments[courseId]}
              rowKey="id"
              pagination={false}
            />
          </div>
        ))}
          </>:""
}
      <Modal
  title="View Assignment"
  open={isModalOpen}
  footer={null}
  onCancel={() => setIsModalOpen(false)}

  className="custom-modal"
  bodyStyle={{ padding: 0, margin: 0 }}
  style={{ zIndex: 91050 }} // Ensure zIndex is high enough
>
        {pdfUrl && (
          <iframe src={pdfUrl} style={{ width: '100%', height: '600px' }} />
        )}
      </Modal>
    </DefaultLayout>
  );
};

export default AssignmentUploadPage;
