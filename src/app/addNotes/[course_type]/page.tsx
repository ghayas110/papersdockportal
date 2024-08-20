"use client";

import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, Select, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

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

interface AddNotesProps {
  params: {
    course_type: string;
  };
}

const AddNotes: React.FC<AddNotesProps> = ({ params }) => {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewNoteModalOpen, setViewNoteModalOpen] = useState(false);
  const [isViewImageModalOpen, setViewImageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [bgImageFileList, setBgImageFileList] = useState<any[]>([]);
  const [notesFileList, setNotesFileList] = useState<any[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [form] = Form.useForm();

  const accessToken = localStorage.getItem('access_token');
  const courseType = params.course_type;

  useEffect(() => {
    if (courseType) {
      fetchNotes();
    }
  }, [courseType]);

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
        setNotes(data.data);
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
    setBgImageFileList([]);
    setNotesFileList([]);
    setAddModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    form.setFieldsValue({
      note_title: note.note_title,
      note_type: note.note_type,
    });

    // Pre-populate the image and notes files in the file lists
    setBgImageFileList([{
      uid: '-1',
      name: note.note_bg_image.split('/').pop(),
      status: 'done',
      url: `https://lms.papersdock.com${note.note_bg_image}`,
    }]);

    setNotesFileList([{
      uid: '-2',
      name: note.note_type === 'dark_mode' ? note.dark_note_attachment.split('/').pop() : note.light_note_attachment.split('/').pop(),
      status: 'done',
      url: `https://lms.papersdock.com${note.note_type === 'dark_mode' ? note.dark_note_attachment : note.light_note_attachment}`,
    }]);

    setEditModalOpen(true);
  };

  const handleDeleteNote = (note: Note) => {
    setSelectedNote(note);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteLoading(true);
    if (selectedNote) {
      try {
        const response = await fetch('https://lms.papersdock.com/notes/delete-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accesstoken': `Bearer ${accessToken}`,
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
      }
      setDeleteModalOpen(false);
      setSelectedNote(null);
      setIsDeleteLoading(false);
    }
  };

  const handleConfirmAdd = async () => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append('note_title', values.note_title);
      formData.append('note_type', values.note_type);
      formData.append('course_type', courseType);
      if (bgImageFileList.length > 0) {
        formData.append('note_bg_image', bgImageFileList[0].originFileObj);
      }
      if (notesFileList.length > 0) {
        formData.append('notes', notesFileList[0].originFileObj);
      }

      const response = await fetch('https://lms.papersdock.com/notes/create-notes', {
        method: 'POST',
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
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
    }
    setIsLoading(false);
    setAddModalOpen(false);
    setBgImageFileList([]);
    setNotesFileList([]);
  };

  const handleConfirmEdit = async () => {
    setIsEditLoading(true);
    try {
      const values = await form.validateFields();
      if (selectedNote) {
        const formData = new FormData();
        formData.append('note_id', selectedNote.note_id);
        formData.append('note_title', values.note_title);
        formData.append('note_type', values.note_type);
        formData.append('course_type', courseType);
        if (bgImageFileList.length > 0) {
          formData.append('note_bg_image', bgImageFileList[0].originFileObj);
        }
        if (notesFileList.length > 0) {
          formData.append('notes', notesFileList[0].originFileObj);
        }

        const response = await fetch('https://lms.papersdock.com/notes/update-notes', {
          method: 'POST',
          headers: {
            'accesstoken': `Bearer ${accessToken}`,
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
    }
    setIsEditLoading(false);
    setEditModalOpen(false);
    setSelectedNote(null);
    setBgImageFileList([]);
    setNotesFileList([]);
  };

  const handleBgImageUploadChange = ({ fileList }: any) => {
    setBgImageFileList(fileList);
  };

  const handleNotesUploadChange = ({ fileList }: any) => {
    setNotesFileList(fileList);
  };

  const handleViewNote = (note: Note) => {
    const noteAttachment = note.note_type === 'dark_mode' ? note.dark_note_attachment : note.light_note_attachment;
    setPdfUrl(`https://lms.papersdock.com${noteAttachment}`);
    setViewNoteModalOpen(true);
  };

  const handleViewImage = (note: Note) => {
    setImageUrl(`https://lms.papersdock.com${note.note_bg_image}`);
    setViewImageModalOpen(true);
  };

  const columns = [
    {
      title: 'Note ID',
      dataIndex: 'note_id',
      key: 'note_id',
    },
    {
      title: 'Note Title',
      dataIndex: 'note_title',
      key: 'note_title',
    },
    {
      title: 'Note Type',
      dataIndex: 'note_type',
      key: 'note_type',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'View Notes',
      key: 'view_notes',
      render: (text: string, record: Note) => (
        <Button type="link" onClick={() => handleViewNote(record)}>
          {record.note_type === 'dark_mode' ? 'View Dark Note' : 'View Light Note'}
        </Button>
      ),
    },
    {
      title: 'View Background Image',
      key: 'view_bg_image',
      render: (text: string, record: Note) => (
        <Button type="link" onClick={() => handleViewImage(record)}>View Image</Button>
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
      <div className="flex justify-between">
        <ArrowLeftOutlined onClick={() => router.back()} className="cursor-pointer"/>
        <h1 className="text-3xl font-bold mb-8">Add Notes</h1>
        <p>.</p>
        </div>
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
          onCancel={() => setAddModalOpen(false)}
          confirmLoading={isLoading}
          okButtonProps={{
            style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' },
            disabled: isLoading,
          }}
        >
          <Form form={form} layout="vertical" name="add_note_form">
            <Form.Item
              name="note_title"
              label="Note Title"
              rules={[{ required: true, message: 'Please input the note title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="note_type"
              label="Note Type"
              rules={[{ required: true, message: 'Please select the note type!' }]}
            >
              <Select>
                <Select.Option value="dark_mode">Dark Mode</Select.Option>
                <Select.Option value="light_mode">Light Mode</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="note_bg_image"
              label="Upload Background Image"
              rules={[{ required: true, message: 'Please upload a background image!' }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleBgImageUploadChange}
                fileList={bgImageFileList}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="notes"
              label="Upload Notes"
              rules={[{ required: true, message: 'Please upload the notes!' }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleNotesUploadChange}
                fileList={notesFileList}
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
          onCancel={() => setEditModalOpen(false)}
          confirmLoading={isEditLoading}
          okButtonProps={{
            style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' },
            disabled: isEditLoading,
          }}
        >
          <Form form={form} layout="vertical" name="edit_note_form">
            <Form.Item
              name="note_title"
              label="Note Title"
              rules={[{ required: true, message: 'Please input the note title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="note_type"
              label="Note Type"
              rules={[{ required: true, message: 'Please select the note type!' }]}
            >
              <Select>
                <Select.Option value="dark_mode">Dark Mode</Select.Option>
                <Select.Option value="light_mode">Light Mode</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="note_bg_image"
              label="Upload Background Image"
              rules={[{ required: false, message: 'Please upload a background image!' }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleBgImageUploadChange}
                fileList={bgImageFileList}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="notes"
              label="Upload Notes"
              rules={[{ required: false, message: 'Please upload the notes!' }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleNotesUploadChange}
                fileList={notesFileList}
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
          onCancel={() => setDeleteModalOpen(false)}
          confirmLoading={isDeleteLoading}
          okButtonProps={{
            style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' },
            disabled: isDeleteLoading,
          }}
        >
          <p>Do you want to delete this note?</p>
        </Modal>

        {/* View Note Modal */}
        <Modal
          title="View Note"
          open={isViewNoteModalOpen}
          footer={null}
          onCancel={() => setViewNoteModalOpen(false)}
        >
          {pdfUrl && <iframe src={pdfUrl} style={{ width: '100%', height: '500px' }} />}
        </Modal>

        {/* View Image Modal */}
        <Modal
          title="View Background Image"
          open={isViewImageModalOpen}
          footer={null}
          onCancel={() => setViewImageModalOpen(false)}
        >
          {imageUrl && <img src={imageUrl} alt="Note Background" style={{ width: '100%' }} />}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default AddNotes;
