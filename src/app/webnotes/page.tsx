"use client";
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Button } from 'antd';

const WebNotes: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (course_type: string) => {
    console.log(course_type);
    if(course_type === 'paper1'){
      router.push(`/webnotes/paper1`);
    }else if(course_type === 'paper2'){
      router.push(`/webnotes/paper2`);
    }else if(course_type === 'paper3'){
      router.push(`/webnotes/paper3`);
    }else{
      router.push(`/webnotes/paper4`);
    }
  
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Recorded Lectures </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
          {['Paper1', 'Paper2', 'Paper3', 'Paper4'].map((course_type, index) => (
               <div key={index} className="cursor-pointer rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark"  onClick={() => handleNavigation(course_type.toLowerCase())}>
    

               <div className="mt-4 flex items-end justify-between">
                 <div>
                   <h4 className="text-title-md font-bold text-black dark:text-white">
                     {course_type}
                   </h4>
               
                 </div>
         
                
               </div>
             </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default WebNotes;
