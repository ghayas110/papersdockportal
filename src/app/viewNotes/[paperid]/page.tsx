"use client";

import { Modal, message } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';

import Header2 from '@/sections/Header2';
import { LuGalleryHorizontal } from 'react-icons/lu';
import NotesCard from '@/components/NotesCard/page';

interface Note {
  note_id: string;
  note_url: string;
  created_at: string;
  name: string;
  image: string;
}

interface ViewWebNotesProps {
  params: {
    paperid: string;
  };
}

const ViewWebNotes: React.FC<ViewWebNotesProps> = ({ params }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const paperNo = params.paperid;

  useEffect(() => {
    fetchNotes();
  }, [paperNo]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('https://be.papersdock.com/notes/get-all-web-notes', {
        headers: {
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setNotes(data.data.filter((note: any) => note.paper === paperNo));
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch notes', error);
      message.error('Failed to fetch notes');
    }
  };

  const handleViewNote = (note: Note) => {
    setPdfUrl(`https://be.papersdock.com${note.note_url}`);
    setViewModalOpen(true);
  };

  const formatFileName = (noteUrl: string) => {
    const fileName = noteUrl.split('/').pop() || ""; // Get file name
    const nameWithoutExtension = fileName.replace('.pdf', ''); // Remove .pdf extension
    // Remove any text before the dash, if present
    const formattedName = nameWithoutExtension.includes('-')
      ? nameWithoutExtension.split('-')[1].trim()
      : nameWithoutExtension;
    return formattedName;
  };

  return (
    <section
      style={{
        flex: 1,
        background: "#F1F5F9",
      }}
      className="h-screen"
    >
      <Header2 />
      <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {notes.length > 0 ? (
          notes.map((note) => {
            const fileName = formatFileName(note.note_url); // Format the file name
            return (
          <>
        
              <NotesCard
              key={note.note_id}
              notesId={note.note_id}
              image={`https://be.papersdock.com${note.image}`}
              title=  {(note.name).toUpperCase()}
              viewNotesUrl={`https://be.papersdock.com${note.note_url}`}
              downloadNotesUrl={`https://be.papersdock.com${note.note_url}`}
            />
              </>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-white">
            <h2>No Notes Found</h2>
          </div>
        )}

        {/* View Note Modal */}
        <Modal
          title="View Note"
          open={isViewModalOpen}
          footer={null}
          onCancel={() => setViewModalOpen(false)}
        >
          {pdfUrl && <iframe src={pdfUrl} style={{ width: '100%', height: '500px' }} />}
        </Modal>
      </div>
    </section>
  );
};

export default ViewWebNotes;
