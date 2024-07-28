// pages/courses/[courseId].tsx
"use client"; // Mark this file as a Client Component
import React from 'react';
import { Table, Button, Space } from 'antd';
import { useRouter } from 'next/navigation';
interface Course {
  courseId: string;
  courseName: string;
  noOfStudents: number;
  noOfLectures: number;
}

const courseData: Course[] = [
  {
    courseId: 'math101',
    courseName: 'Mathematics',
    noOfStudents: 30,
    noOfLectures: 15,
  },
  {
    courseId: 'phys101',
    courseName: 'Physics',
    noOfStudents: 25,
    noOfLectures: 10,
  },
  {
    courseId: 'chem101',
    courseName: 'Chemistry',
    noOfStudents: 28,
    noOfLectures: 12,
  },
  // Add more courses as needed
];

const CoursesTable: React.FC = () => {
  const columns = [
    {
      title: 'Course ID',
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'No of Students',
      dataIndex: 'noOfStudents',
      key: 'noOfStudents',
    },
    {
      title: 'No of Lectures',
      dataIndex: 'noOfLectures',
      key: 'noOfLectures',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Course) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handlePreview(record.courseId)}
            style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
          >
            Preview
          </Button>
        </Space>
      ),
    },
  ];
  const router = useRouter();
  const handlePreview = (courseId: string) => {
    // Implement the preview logic here, e.g., navigate to course details page
    router.push(`/courses/${courseId}`);
    console.log(`Preview course details for course ID: ${courseId}`);
  };

  return (
    <Table columns={columns} dataSource={courseData} rowKey="courseId" />
  );
};

export default CoursesTable;
