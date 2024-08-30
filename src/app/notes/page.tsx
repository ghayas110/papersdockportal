"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, Button, Modal, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import NotesCard from '@/components/NotesCard/page';

const { TabPane } = Tabs;

interface Note {
  note_id: string;
  note_title: string;
  note_type: string;
  created_at: string;
  note_bg_image: string;
  dark_note_attachment: string;
  light_note_attachment: string;
  course_type: string;
}

const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [asBool,setAsBool]=useState(false)
  const [osBool,setOsBool]=useState(false)
  const accessToken = localStorage.getItem('access_token');


  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    if (userData.selected_course) {
      setSelectedCourse(userData.selected_course);
      fetchNotes();
    }
  }, []);
  const fetchNotes = async () => {
    try {
      const response = await fetch('https://www.be.papersdock.com/notes/get-all-notes', {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotes(data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch notes', error);
      message.error('Failed to fetch notes');
    }
  };

  const handleViewNote = (note: Note) => {
    const noteAttachment = note.note_type === 'dark_mode' ? note.dark_note_attachment : note.light_note_attachment;
    setPdfUrl(`https://www.be.papersdock.com${noteAttachment}`);
    setSelectedNote(note);
    setViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setViewModalOpen(false);
    setPdfUrl(null);
    setSelectedNote(null);
  };

  // Group notes by course_type
  const groupedNotes = notes.reduce((acc: { [key: string]: Note[] }, note) => {
    if (!acc[note.course_type]) {
      acc[note.course_type] = [];
    }
    acc[note.course_type].push(note);
    return acc;
  }, {});

  return (
    <DefaultLayout>
   
{selectedCourse=="Both"?
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
:<>
{Object.keys(groupedNotes).map((courseType) => (
        <div key={courseType}>
       
          <Tabs defaultActiveKey="dark_mode">
            <TabPane tab="Dark Mode" key="dark_mode">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
                {groupedNotes[courseType]
                  .filter(note => note.note_type === 'dark_mode')
                  .map((note) => (
                    <NotesCard
                      key={note.note_id}
                      notesId={note.note_id}
                      image={`https://www.be.papersdock.com${note.note_bg_image}`}
                      title={note.note_title}
                      viewNotesUrl={`https://www.be.papersdock.com${note.dark_note_attachment}`}
                      downloadNotesUrl={`https://www.be.papersdock.com${note.dark_note_attachment}`}
                    />
                  ))}
              </div>
            </TabPane>
            <TabPane tab="Light Mode" key="light_mode">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
                {groupedNotes[courseType]
                  .filter(note => note.note_type === 'light_mode')
                  .map((note) => (
                    <NotesCard
                      key={note.note_id}
                      notesId={note.note_id}
                      image={`https://www.be.papersdock.com${note.note_bg_image}`}
                      title={note.note_title}
                      viewNotesUrl={`https://www.be.papersdock.com${note.light_note_attachment}`}
                      downloadNotesUrl={`https://www.be.papersdock.com${note.light_note_attachment}`}
                    />
                  ))}
              </div>
            </TabPane>
          </Tabs>
        </div>
      ))}
</>

}
   

{
          asBool?
          <>
         {Object.keys(groupedNotes).filter((courseType) => courseType === "AS").map((courseType) => (
        <div key={courseType}>
        
          <Tabs defaultActiveKey="dark_mode">
            <TabPane tab="Dark Mode" key="dark_mode">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
                {groupedNotes[courseType]
                  .filter(note => note.note_type === 'dark_mode')
                  .map((note) => (
                    <NotesCard
                      key={note.note_id}
                      notesId={note.note_id}
                      image={`https://www.be.papersdock.com${note.note_bg_image}`}
                      title={note.note_title}
                      viewNotesUrl={`https://www.be.papersdock.com${note.dark_note_attachment}`}
                      downloadNotesUrl={`https://www.be.papersdock.com${note.dark_note_attachment}`}
                    />
                  ))}
              </div>
            </TabPane>
            <TabPane tab="Light Mode" key="light_mode">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
                {groupedNotes[courseType]
                  .filter(note => note.note_type === 'light_mode')
                  .map((note) => (
                    <NotesCard
                      key={note.note_id}
                      notesId={note.note_id}
                      image={`https://www.be.papersdock.com${note.note_bg_image}`}
                      title={note.note_title}
                      viewNotesUrl={`https://www.be.papersdock.com${note.light_note_attachment}`}
                      downloadNotesUrl={`https://www.be.papersdock.com${note.light_note_attachment}`}
                    />
                  ))}
              </div>
            </TabPane>
          </Tabs>
        </div>
      ))}
          </>
          :osBool?
          <>
      {Object.keys(groupedNotes).filter((courseType) => courseType === "OS").map((courseType) => (
        <div key={courseType}>
        
          <Tabs defaultActiveKey="dark_mode">
            <TabPane tab="Dark Mode" key="dark_mode">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
                {groupedNotes[courseType]
                  .filter(note => note.note_type === 'dark_mode')
                  .map((note) => (
                    <NotesCard
                      key={note.note_id}
                      notesId={note.note_id}
                      image={`https://www.be.papersdock.com${note.note_bg_image}`}
                      title={note.note_title}
                      viewNotesUrl={`https://www.be.papersdock.com${note.dark_note_attachment}`}
                      downloadNotesUrl={`https://www.be.papersdock.com${note.dark_note_attachment}`}
                    />
                  ))}
              </div>
            </TabPane>
            <TabPane tab="Light Mode" key="light_mode">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
                {groupedNotes[courseType]
                  .filter(note => note.note_type === 'light_mode')
                  .map((note) => (
                    <NotesCard
                      key={note.note_id}
                      notesId={note.note_id}
                      image={`https://www.be.papersdock.com${note.note_bg_image}`}
                      title={note.note_title}
                      viewNotesUrl={`https://www.be.papersdock.com${note.light_note_attachment}`}
                      downloadNotesUrl={`https://www.be.papersdock.com${note.light_note_attachment}`}
                    />
                  ))}
              </div>
            </TabPane>
          </Tabs>
        </div>
      ))}
          </>
          :""

        }
      <Modal
        title="View Note"
        open={isViewModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        {pdfUrl && <iframe src={pdfUrl} style={{ width: '100%', height: '500px' }} />}
      </Modal>
    </DefaultLayout>
  );
};

export default NotesView;
