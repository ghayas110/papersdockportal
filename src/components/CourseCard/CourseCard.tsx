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
    <img className="w-full h-48 object-contain" src={image} alt={title} />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{title}</div>
    

    </div>
  </div>
  </Link>
  );
};

export default CourseCard;
