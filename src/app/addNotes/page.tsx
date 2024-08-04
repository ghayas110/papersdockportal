"use client";
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/Layouts/DefaultLayout';


const AddNotes: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (course_type: string) => {
    router.push(`/addNotes/${course_type}`);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Add Notes </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
          {['AS', 'A2', 'Composite'].map((course_type) => (
            <div
              key={course_type}
              className="p-6 bg-gray-200 rounded-lg shadow-lg text-center hover:bg-gray-300 cursor-pointer"
              onClick={() => handleNavigation(course_type.toLowerCase())}
            >
              <h2 className="text-2xl font-bold mb-4">{course_type}</h2>
           
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddNotes;
