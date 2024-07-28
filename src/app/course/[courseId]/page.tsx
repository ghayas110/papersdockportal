// pages/courses/[courseId].tsx
"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Lecture {
  number: number;
  title: string;
  duration: string;
}

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

const CoursePage: React.FC<CoursePageProps> = ({ params }) => {
  const router = useRouter();

  const lectures: Lecture[] = [
    { number: 1, title: 'Atomic Structure', duration: '50 mins' },
    { number: 2, title: 'Chemical Bonding', duration: '55 mins' },
    { number: 3, title: 'Stoichiometry', duration: '60 mins' },
  ];

  const handleClick = (vedioId: number) => () => {
    router.push(`/course/${params?.courseId}/${vedioId}`);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center">
          <img
            className="w-full rounded-lg mb-4"
            src="https://media.geeksforgeeks.org/wp-content/uploads/20230503013704/Mathematics-Banner.webp"
            alt="Course Banner"
          />
          <div className="w-full rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="mb-6 flex justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Mathematics</h1>
                <p className="text-lg text-gray-700 mb-4">Instructor: John</p>
              </div>
              <p className="text-base text-gray-600">Course ID: {params.courseId}</p>
            </div>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      No.
                    </th>
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                      Title
                    </th>
                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                      Duration
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lectures.map((lecture) => (
                    <tr key={lecture.number}>
                      <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                        <p className="text-black dark:text-white">{lecture.number}</p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <h5 className="font-medium text-black dark:text-white">{lecture.title}</h5>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">{lecture.duration}</p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                            onClick={handleClick(lecture.number)}
                          >
                            Play
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CoursePage;
