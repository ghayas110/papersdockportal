"use client";

import { Table, Button, Modal, message } from 'antd';
import { useState, useEffect } from 'react';
import moment from 'moment';

import Header2 from '@/sections/Header2';
interface Note {
  note_id: string;
  note_url: string;
  created_at: string;
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

  const columns = [

    {
      title: 'Note Title',
      dataIndex: 'note_url',
      key: 'note_url',
      render: (text: string) => {
        const fileName = text.split('/').pop();
        return fileName;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Download Note',
      key: 'note_url',
      render: (text: string, record: Note) => (
        <Button type="link" onClick={() => handleViewNote(record)}>View Note</Button>
      ),
    },
  ];

  return (
    <section
    style={{
      background: "linear-gradient(#010E24,#4e7387,#010E24, #010E24,#010E24, #4e7387, #010E24)",
  }}
    className="h-screen">
      <Header2/>
      <div className="container mx-auto p-8">

        <Table columns={columns} dataSource={notes} rowKey="note_id" />

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
