"use client";
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Button } from 'antd';

const StudentApproval: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (course_type: string) => {
    console.log(course_type);
    if(course_type === 'as'){
      router.push(`/studentApproval/AS`);
    }else if(course_type === 'a2'){
      router.push(`/studentApproval/OS`);
    }else if(course_type === 'composite'){
      router.push(`/studentApproval/Both`);
    }else if(course_type === 'p2 crash course'){

      router.push(`/studentApproval/P2_Crash_Course`);
    
    }else if(course_type === 'p4 crash course'){

      router.push(`/studentApproval/P4_Crash_Course`);
  
  }else if(course_type === 'crash composite'){

    router.push(`/studentApproval/Crash_Composite`);
  
  }
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Student Approvval </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
          {[ "AS",
            "A2",
            "Composite",
            "P2 Crash Course",
            "P4 Crash Course",
            "Crash Composite",].map((course_type, index) => (
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

export default StudentApproval;
