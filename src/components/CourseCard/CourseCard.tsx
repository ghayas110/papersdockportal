// components/CourseCard.tsx
import Link from 'next/link';
import React from 'react';

interface CourseCardProps {
    courseId: string;
  image: string;
  title: string;
  instructor: string;
}

const CourseCard: React.FC<CourseCardProps> = ({courseId, image, title, instructor }) => {
  return (
    <Link href={`/course/${courseId}`}>

 
    <div className="max-w-lg rounded overflow-hidden shadow-lg bg-white m-4">
    <img className="w-full" src={image} alt={title} />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{title}</div>
      <p className="text-gray-700 text-base">Course ID: {courseId}</p>
      <p className="text-gray-700 text-base">Instructor: {instructor}</p>
    </div>
  </div>
  </Link>
  );
};

export default CourseCard;
