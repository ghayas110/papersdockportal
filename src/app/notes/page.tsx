import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CourseCard from "@/components/CourseCard/CourseCard";
import NotesCard from "@/components/NotesCard/page";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};


const NotesFile = () => {

  const notesData = [
    {
      notesId: "A2",
      image: "https://media.geeksforgeeks.org/wp-content/uploads/20230503013704/Mathematics-Banner.webp",
      title: "Notes 1: Mathematics for O-Level",
      viewNotesUrl:"https://file-examples.com/storage/fe3f15b9da66a36baa1b51a/2017/10/file-sample_150kB.pdf",
      downloadNotesUrl:"https://file-examples.com/storage/fe3f15b9da66a36baa1b51a/2017/10/file-sample_150kB.pdf" 
    },
    {
      notesId: "A3",
      image: "https://media.geeksforgeeks.org/wp-content/uploads/20240502160218/Physics.webp",
      title: "Notes 2: Physics for O-Level",
      viewNotesUrl:"https://file-examples.com/storage/fe3f15b9da66a36baa1b51a/2017/10/file-sample_150kB.pdf",
      downloadNotesUrl:"https://file-examples.com/storage/fe3f15b9da66a36baa1b51a/2017/10/file-sample_150kB.pdf" 
    },
    {
      notesId: "A4",
      image: "https://media.geeksforgeeks.org/wp-content/uploads/20231110153856/Biology-copy.webp",
      title: "Notes 3: Biology for O-Level",
      viewNotesUrl:"https://file-examples.com/storage/fe3f15b9da66a36baa1b51a/2017/10/file-sample_150kB.pdf",
      downloadNotesUrl:"https://file-examples.com/storage/fe3f15b9da66a36baa1b51a/2017/10/file-sample_150kB.pdf" 
    },
    {
      notesId: "A5",
      image: "https://miro.medium.com/v2/resize:fit:1400/1*ycIMlwgwicqlO6PcFRA-Iw.png",
      title: "Notes 4: Python for O-Level",
      viewNotesUrl:"https://file-examples.com/storage/fe3f15b9da66a36baa1b51a/2017/10/file-sample_150kB.pdf",
      downloadNotesUrl:"https://file-examples.com/storage/fe3f15b9da66a36baa1b51a/2017/10/file-sample_150kB.pdf" 
    }
  ];
  
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Notes" course="A2" />
      <h3 className="text-title-md2 font-bold text-black dark:text-white">
        A2 Notes
      </h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
      {notesData.map((notes) => (
          <NotesCard 
            key={notes.notesId}
            notesId={notes.notesId}
            image={notes.image}
            title={notes.title}
            viewNotesUrl={notes.viewNotesUrl}
            downloadNotesUrl={notes.downloadNotesUrl} 

           
          />
        ))}
   
      </div>
      <div className="flex flex-col gap-10">
      
      </div>
    </DefaultLayout>
  );
};

export default NotesFile;
