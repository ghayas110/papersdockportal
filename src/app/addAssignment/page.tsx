"use client";
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/Layouts/DefaultLayout';


const AddAssignment: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (classId: string) => {
    router.push(`/addAssignment/${classId}`);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Add Assignment </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
          {['AS', 'A2', 'Composite'].map((classId) => (
            <div
              key={classId}
              className="p-6 bg-gray-200 rounded-lg shadow-lg text-center hover:bg-gray-300 cursor-pointer"
              onClick={() => handleNavigation(classId.toLowerCase())}
            >
              <h2 className="text-2xl font-bold mb-4">{classId}</h2>
           
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddAssignment;
