import React from "react";

interface BreadcrumbProps {
  pageName: string;
  course?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageName, course }) => {
  return (
    <nav className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md w-full">
      <ol className="list-reset flex">
        <li>
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Home</a>
        </li>
        <li><span className="mx-2 text-gray-500">/</span></li>
        <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">{course}</a></li>
        <li><span className="mx-2 text-gray-500">/</span></li>
        <li className="text-gray-500">{pageName}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
