// pages/courses/[courseId].tsx
"use client"; // Mark this file as a Client Component
import React from 'react';
import { useRouter } from 'next/navigation';
import { Table } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

interface Lecture {
  id: string;
  title: string;
  date: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
}

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

interface Course {
  courseId: string;
  courseName: string;
  description: string;
  noOfStudents: number;
  lectures: Lecture[];
  assignments: Assignment[];
}

const courseData: Course[] = [
  {
    courseId: 'math101',
    courseName: 'Mathematics',
    description: 'This is a course about Algebra and Geometry.',
    noOfStudents: 30,
    lectures: [
      { id: '1', title: 'Algebra Basics', date: '2024-01-10' },
      { id: '2', title: 'Geometry Basics', date: '2024-01-15' },
    ],
    assignments: [
      { id: '1', title: 'Algebra Assignment', dueDate: '2024-01-20' },
      { id: '2', title: 'Geometry Assignment', dueDate: '2024-01-25' },
    ],
  },
  // Add more course data as needed
];

const CoursePreview: React.FC<CoursePageProps> = ({ params }) => {
  const router = useRouter();
  const courseId = params?.courseId;
  console.log(courseId);

  const course = courseData.find((course) => course.courseId === courseId);

  if (!course) {
    return <p>Course not found</p>;
  }

  const lectureColumns = [
    {
      title: 'Lecture Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const assignmentColumns = [
    {
      title: 'Assignment Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>
        <p className="text-lg mb-4">{course.description}</p>
        <p className="text-lg mb-8">Number of Students: {course.noOfStudents}</p>

        <h2 className="text-2xl font-semibold mb-4">Lectures</h2>
        <Table
          columns={lectureColumns}
          dataSource={course.lectures}
          rowKey="id"
          pagination={false}
          className="mb-8"
        />

        <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
        <Table
          columns={assignmentColumns}
          dataSource={course.assignments}
          rowKey="id"
          pagination={false}
        />
      </div>
    </DefaultLayout>
  );
};

export default CoursePreview;
