import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CourseCard from "@/components/CourseCard/CourseCard";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};


const Lectures = () => {

  const lecturesData = [
    {
      courseId: "A2",
      image: "https://media.geeksforgeeks.org/wp-content/uploads/20230503013704/Mathematics-Banner.webp",
      title: "Chapter 1: Mathematics for O-Level",
      instructor: "John Doe"
    },
    {
      courseId: "A3",
      image: "https://media.geeksforgeeks.org/wp-content/uploads/20240502160218/Physics.webp",
      title: "Chapter 2: Physics for O-Level",
      instructor: "John Doe"
    },
    {
      courseId: "A4",
      image: "https://media.geeksforgeeks.org/wp-content/uploads/20231110153856/Biology-copy.webp",
      title: "Chapter 3: Biology for O-Level",
      instructor: "John Doe"
    },
    {
      courseId: "A5",
      image: "https://miro.medium.com/v2/resize:fit:1400/1*ycIMlwgwicqlO6PcFRA-Iw.png",
      title: "Chapter 4: Python for O-Level",
      instructor: "John Doe"
    }
  ];
  
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Lectures" course="A2" />
      <h3 className="text-title-md2 font-bold text-black dark:text-white">
        A2 Lectures
      </h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
      {lecturesData.map((lecture) => (
          <CourseCard 
            key={lecture.courseId}
            courseId={lecture.courseId}
            image={lecture.image}
            title={lecture.title}
            instructor={lecture.instructor} 
          />
        ))}
   
      </div>
      <div className="flex flex-col gap-10">
      
      </div>
    </DefaultLayout>
  );
};

export default Lectures;
