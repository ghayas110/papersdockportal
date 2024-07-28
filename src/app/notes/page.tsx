"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

interface NoteFile {
  id: string;
  name: string;
  url: string;
}

interface CourseNotes {
  courseId: string;
  courseName: string;
  files: NoteFile[];
}

const notesData: CourseNotes[] = [
  {
    courseId: 'math101',
    courseName: 'Mathematics',
    files: [
      { id: '1', name: 'Algebra Notes', url: 'https://example.com/algebra.pdf' },
      { id: '2', name: 'Geometry Notes', url: 'https://example.com/geometry.pdf' },
    ],
  },
  {
    courseId: 'phys101',
    courseName: 'Physics',
    files: [
      { id: '3', name: 'Mechanics Notes', url: 'https://example.com/mechanics.pdf' },
      { id: '4', name: 'Thermodynamics Notes', url: 'https://example.com/thermodynamics.pdf' },
      { id: '4', name: 'Thermodynamics Notes', url: 'https://example.com/thermodynamics.pdf' },
      { id: '4', name: 'Thermodynamics Notes', url: 'https://example.com/thermodynamics.pdf' },
    ],
  },
  {
    courseId: 'phys101',
    courseName: 'Computer Science',
    files: [
      { id: '3', name: 'Mechanics Notes', url: 'https://example.com/mechanics.pdf' },
      { id: '4', name: 'Thermodynamics Notes', url: 'https://example.com/thermodynamics.pdf' },
      { id: '4', name: 'Thermodynamics Notes', url: 'https://example.com/thermodynamics.pdf' },
      { id: '4', name: 'Thermodynamics Notes', url: 'https://example.com/thermodynamics.pdf' },
    ],
  },
  // Add more courses and notes as needed
];

const NotesPage: React.FC = () => {
  const [downloadedFiles, setDownloadedFiles] = useState<{ [key: string]: boolean }>({});

  const handleDownload = (fileId: string) => {
    setDownloadedFiles((prev) => ({ ...prev, [fileId]: true }));
  };

  return (
    <DefaultLayout>
                   <Breadcrumb pageName="Notes" course="Notes" />
      <div className="container mx-auto p-8">
        {notesData.map((course) => (
          <div key={course.courseId} className="mb-4">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-[rgb(28,36,52)] rounded-lg hover:bg-opacity-90 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
                  >
                    <span>{course.courseName}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-white`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-white bg-[rgb(28,36,52)]">
                    <ul>
                      {course.files.map((file) => (
                        <li key={file.id} className="mb-2 flex justify-between items-center">
                          <span>{file.name}</span>
                          <a
                            href={file.url}
                            download
                            className={`px-4 py-2 rounded ${
                              downloadedFiles[file.id]
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}
                            onClick={() => handleDownload(file.id)}
                          >
                            Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default NotesPage;
