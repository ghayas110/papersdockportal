"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, Button, Modal, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
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

  const accessToken = localStorage.getItem('access_token');
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const selectedCourse = userData.selected_course;

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('https://lms.papersdock.com/notes/get-all-notes', {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotes(data.data.filter((note: any) => note.course_type === selectedCourse));
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
    setPdfUrl(`https://lms.papersdock.com${noteAttachment}`);
    setSelectedNote(note);
    setViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setViewModalOpen(false);
    setPdfUrl(null);
    setSelectedNote(null);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Notes" course={selectedCourse} />
      <h3 className="text-title-md2 font-bold text-black dark:text-white">
        {selectedCourse} Notes
      </h3>
      <Tabs defaultActiveKey="dark_mode">
        <TabPane tab="Dark Mode" key="dark_mode">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
            {notes.filter(note => note.note_type === 'dark_mode').map((note) => (
              <NotesCard
                key={note.note_id}
                notesId={note.note_id}
                image={`https://lms.papersdock.com${note.note_bg_image}`}
                title={note.note_title}
                viewNotesUrl={`https://lms.papersdock.com${note.dark_note_attachment}`}
                downloadNotesUrl={`https://lms.papersdock.com${note.dark_note_attachment}`}
              />
            ))}
          </div>
        </TabPane>
        <TabPane tab="Light Mode" key="light_mode">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
            {notes.filter(note => note.note_type === 'light_mode').map((note) => (
              <NotesCard
                key={note.note_id}
                notesId={note.note_id}
                image={`https://lms.papersdock.com${note.note_bg_image}`}
                title={note.note_title}
                viewNotesUrl={`https://lms.papersdock.com${note.light_note_attachment}`}
                downloadNotesUrl={`https://lms.papersdock.com${note.light_note_attachment}`}
              />
            ))}
          </div>
        </TabPane>
      </Tabs>

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
