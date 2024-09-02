"use client";

import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Note {
  note_id: string;
  paper: string;
  note_url: string;
  created_at: string;
}

interface PaperProps {
  params: {
    paperno: string;
  };
}

const AddWebNotes: React.FC<PaperProps> = ({ params }) => {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const paperNo = params.paperno;

  useEffect(() => {
    if (paperNo) {
      fetchNotes();
    }
  }, [paperNo]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('https://be.papersdock.com/notes/get-all-web-notes', {
        headers: {
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      console.log(data)
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

  const handleAddNote = () => {
    setSelectedNote(null);
    form.resetFields();
    setFileList([]);
    setAddModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    form.setFieldsValue({
      note_id: note.note_id,
      paper: note.paper,
    });
    setFileList([]);
    setEditModalOpen(true);
  };

  const handleDeleteNote = (note: Note) => {
    setSelectedNote(note);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedNote) {
      setDeleteLoading(true);
      try {
        const response = await fetch('https://be.papersdock.com/notes/delete-web-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'lms_API',
          },
          body: JSON.stringify({ note_id: selectedNote.note_id }),
        });
        const data = await response.json();
        if (response.ok) {
          setNotes(notes.filter((note) => note.note_id !== selectedNote.note_id));
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error('Failed to delete note', error);
        message.error('Failed to delete note');
      } finally {
        setDeleteLoading(false);
        setDeleteModalOpen(false);
        setSelectedNote(null);
      }
    }
  };

  const handleConfirmAdd = async () => {
    try {
      const values = await form.validateFields();
      setAddLoading(true);
      const formData = new FormData();
      formData.append('paper', paperNo);
      if (fileList.length > 0) {
        formData.append('note', fileList[0].originFileObj);
      }

      const response = await fetch('https://be.papersdock.com/notes/create-web-notes', {
        method: 'POST',
        headers: {
          'x-api-key': 'lms_API',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        message.success(data.message);
        fetchNotes();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to add note', error);
      message.error('Failed to add note');
    } finally {
      setAddLoading(false);
      setAddModalOpen(false);
      setFileList([]);
    }
  };

  const handleConfirmEdit = async () => {
    try {
      const values = await form.validateFields();
      setEditLoading(true);
      if (selectedNote) {
        const formData = new FormData();
        formData.append('note_id', selectedNote.note_id);
        formData.append('paper', paperNo);
        if (fileList.length > 0) {
          formData.append('note', fileList[0].originFileObj);
        }

        const response = await fetch('https://be.papersdock.com/notes/update-web-notes', {
          method: 'POST',
          headers: {
            'x-api-key': 'lms_API',
          },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          message.success(data.message);
          fetchNotes();
        } else {
          message.error(data.message);
        }
      }
    } catch (error) {
      console.error('Failed to edit note', error);
      message.error('Failed to edit note');
    } finally {
      setEditLoading(false);
      setEditModalOpen(false);
      setSelectedNote(null);
      setFileList([]);
    }
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleViewNote = (note: Note) => {
    setPdfUrl(`https://be.papersdock.com${note.note_url}`);
    setViewModalOpen(true);
  };

  const columns = [
    {
      title: 'Note ID',
      dataIndex: 'note_id',
      key: 'note_id',
    },
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
      title: 'View Note',
      key: 'note_url',
      render: (text: string, record: Note) => (
        <Button type="link" onClick={() => handleViewNote(record)}>View Note</Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Note) => (
        <Space size="middle">
          <Button
            onClick={() => handleEditNote(record)}
            style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)', color: 'white' }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteNote(record)}
            style={{ color: 'red', borderColor: 'rgb(28, 36, 52)' }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8"> {paperNo}</h1>
        <Button
          type="primary"
          className="mb-4"
          onClick={handleAddNote}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Note
        </Button>
        <Table columns={columns} dataSource={notes} rowKey="note_id" />

        {/* Add Note Modal */}
        <Modal
          title="Add Note"
          open={isAddModalOpen}
          onOk={handleConfirmAdd}
          confirmLoading={addLoading}
          onCancel={() => setAddModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="add_note_form">
            <Form.Item
              name="note"
              label="Upload Note File"
              rules={[{ required: true, message: 'Please upload a note file!' }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                fileList={fileList}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Note Modal */}
        <Modal
          title="Edit Note"
          open={isEditModalOpen}
          onOk={handleConfirmEdit}
          confirmLoading={editLoading}
          onCancel={() => setEditModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="edit_note_form">
            <Form.Item
              name="note"
              label="Upload Note File"
              rules={[{ required: false, message: 'Please upload a note file!' }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                fileList={fileList}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Note Modal */}
        <Modal
          title="Confirm Deletion"
          open={isDeleteModalOpen}
          onOk={handleConfirmDelete}
          confirmLoading={deleteLoading}
          onCancel={() => setDeleteModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <p>Do you want to delete this record?</p>
        </Modal>

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
    </DefaultLayout>
  );
};

export default AddWebNotes;
