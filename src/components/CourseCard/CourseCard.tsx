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
    <img className="w-full h-full object-cover" src={image} alt={title} />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2 text-black">{title}</div>
      <div className="mt-4 flex space-x-4">
          <a
            href={`/course/${courseId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[rgb(28,36,52)] hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
          >
            View Lectures
          </a>
       
        </div>

    </div>
  </div>
  </Link>
  );
};

export default CourseCard;
