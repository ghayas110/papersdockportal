"use client";

import { useEffect, useState } from "react";
import { message } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CourseCard from "@/components/CourseCard/CourseCard";

interface Chapter {
  chap_id: number;
  course_type: string;
  chapter_name: string;
  chapter_image_url: string;
}

const CourseView: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    if (userData.selected_course) {
      setSelectedCourse(userData.selected_course);
      fetchChapters(userData.selected_course);
    }
  }, []);

  const fetchChapters = async (courseType: string) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await fetch("https://lms.papersdock.com/chapters/get-all-chapters", {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setChapters(data.data.filter((chapter: Chapter) => chapter.course_type === courseType));
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch chapters', error);
      message.error('Failed to fetch chapters');
    }
  };

  return (
    <DefaultLayout>

      <h3 className="text-title-md2 font-bold text-black dark:text-white">
        {selectedCourse} Chapters
      </h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        {chapters.map((chapter) => (
          <CourseCard 
            key={chapter.chap_id}
            courseId={chapter.chap_id.toString()}
            image={`https://lms.papersdock.com${chapter.chapter_image_url}`}
            title={chapter.chapter_name}
            instructor={selectedCourse || ""}
          />
        ))}
      </div>
      <div className="flex flex-col gap-10"></div>
    </DefaultLayout>
  );
};

export default CourseView;
