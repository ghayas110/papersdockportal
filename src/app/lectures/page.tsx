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
  const [asBool,setAsBool]=useState(false)
  const [osBool,setOsBool]=useState(false)

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
      const response = await fetch("https://www.be.papersdock.com/chapters/get-all-chapters", {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setChapters(data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch chapters', error);
      message.error('Failed to fetch chapters');
    }
  };

  // Group chapters by course_type
  const groupedChapters = chapters.reduce((acc: { [key: string]: Chapter[] }, chapter) => {
    if (!acc[chapter.course_type]) {
      acc[chapter.course_type] = [];
    }
    acc[chapter.course_type].push(chapter);
    return acc;
  }, {});

  return (
    <DefaultLayout>
      
      {/* Iterate over each course_type group and render the chapters */}
      {
        selectedCourse=="Both"?
        <>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
            <div className={`cursor-pointer rounded-sm border border-stroke bg-${asBool?"muted":"white"} px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark`}  onClick={()=>{
          setAsBool(true)
          setOsBool(false)
        }}>
    

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  AS
                </h4>
            
              </div>
      
             
            </div>
          </div>
          <div className={`cursor-pointer rounded-sm border border-stroke bg-${osBool?"muted":"white"} px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark`}  onClick={()=>{
          setOsBool(true)
          setAsBool(false)
        }}>
    

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  A2
                </h4>
            
              </div>
      
             
            </div>
          </div>
        </div>
        </>
        :
        <>
        {Object.keys(groupedChapters).map((courseType) => (
          <div key={courseType}>
            {/* <h1 className="text-lg font-bold mb-4">{courseType}</h1> */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
              {groupedChapters[courseType].map((chapter) => (
                <CourseCard
                  key={chapter.chap_id}
                  courseId={chapter.chap_id.toString()}
                  image={`https://www.be.papersdock.com${chapter.chapter_image_url}`}
                  title={chapter.chapter_name}
                  instructor={selectedCourse || ""}
                />
              ))}
            </div>
          </div>
        ))}
        </>
      }

{
          asBool?
          <>
          {Object.keys(groupedChapters).filter((courseType) => courseType === "AS").map((courseType) => (
          <div key={courseType}>
            {/* <h1 className="text-lg font-bold mb-4">{courseType}</h1> */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
              {groupedChapters[courseType].map((chapter) => (
                <CourseCard
                  key={chapter.chap_id}
                  courseId={chapter.chap_id.toString()}
                  image={`https://www.be.papersdock.com${chapter.chapter_image_url}`}
                  title={chapter.chapter_name}
                  instructor={selectedCourse || ""}
                />
              ))}
            </div>
          </div>
        ))}
          </>
          :osBool?
          <>
          {Object.keys(groupedChapters).filter((courseType) => courseType === "OS").map((courseType) => (
          <div key={courseType}>
            {/* <h1 className="text-lg font-bold mb-4">{courseType}</h1> */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
              {groupedChapters[courseType].map((chapter) => (
                <CourseCard
                  key={chapter.chap_id}
                  courseId={chapter.chap_id.toString()}
                  image={`https://www.be.papersdock.com${chapter.chapter_image_url}`}
                  title={chapter.chapter_name}
                  instructor={selectedCourse || ""}
                />
              ))}
            </div>
          </div>
        ))}
          </>
          :""

        }
    
      <div className="flex flex-col gap-10"></div>
    </DefaultLayout>
  );
};

export default CourseView;
