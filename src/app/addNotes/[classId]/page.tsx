"use client";
import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

interface Note {
  sno: number;
  id: string;
  title: string;
  date: string;
  noteFile?: File;
}

const initialNoteData: Note[] = [
  { sno: 1, id: 'note1', title: 'Note 1: Introduction', date: '2024-01-01' },
  { sno: 2, id: 'note2', title: 'Note 2: Advanced Topics', date: '2024-01-15' },
  // Add more notes as needed
];

interface CoursePageProps {
  params: {
    classId: string;
    courseId: string;
  };
}

const CourseNotes: React.FC<CoursePageProps> = ({ params }) => {
  const router = useRouter();
  const courseId = params.courseId;
  const classId = params.classId;
  const [notes, setNotes] = useState(initialNoteData);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [form] = Form.useForm();

  const handleAddNote = () => {
    setSelectedNote(null);
    form.resetFields();
    setFileList([]);
    setAddModalVisible(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    form.setFieldsValue({
      id: note.id,
      title: note.title,
    });
    setFileList(note.noteFile ? [{ uid: '-1', name: note.noteFile.name, status: 'done', url: URL.createObjectURL(note.noteFile) }] : []);
    setEditModalVisible(true);
  };

  const handleDeleteNote = (note: Note) => {
    setSelectedNote(note);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedNote) {
      setNotes(notes.filter((note) => note.id !== selectedNote.id));
      setDeleteModalVisible(false);
      setSelectedNote(null);
    }
  };

  const handleConfirmAdd = () => {
    form.validateFields().then(values => {
      if (fileList.length === 0) {
        message.error('Please upload a note file!');
        return;
      }
      const newNote: Note = {
        sno: notes.length + 1,
        id: values.id,
        title: values.title,
        date: new Date().toISOString().split('T')[0],
        noteFile: fileList[0].originFileObj,
      };
      setNotes([...notes, newNote]);
      setAddModalVisible(false);
      setFileList([]);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleConfirmEdit = () => {
    form.validateFields().then(values => {
      if (selectedNote) {
        const updatedNote = {
          ...selectedNote,
          id: values.id,
          title: values.title,
          date: new Date().toISOString().split('T')[0],
          noteFile: fileList.length > 0 ? fileList[0].originFileObj : selectedNote.noteFile,
        };
        setNotes(notes.map(note =>
          note.id === selectedNote.id ? updatedNote : note
        ));
        setEditModalVisible(false);
        setSelectedNote(null);
        setFileList([]);
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleViewNote = (note: Note) => {
    setFileUrl(URL.createObjectURL(note.noteFile as File));
    setViewModalVisible(true);
  };

  const columns = [
    {
      title: 'SNO',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Note Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'View Note',
      key: 'noteFile',
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
        <h1 className="text-3xl font-bold mb-8">Class {classId} - Notes</h1>
        <Button
          type="primary"
          className="mb-4"
          onClick={handleAddNote}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Note
        </Button>
        <Table columns={columns} dataSource={notes} rowKey="id" />

        {/* Add Note Modal */}
        <Modal
          title="Add Note"
          visible={isAddModalVisible}
          onOk={handleConfirmAdd}
          onCancel={() => setAddModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="add_note_form">
            <Form.Item
              name="id"
              label="Note ID"
              rules={[{ required: true, message: 'Please input the note ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="Note Title"
              rules={[{ required: true, message: 'Please input the note title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="noteFile"
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
          visible={isEditModalVisible}
          onOk={handleConfirmEdit}
          onCancel={() => setEditModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="edit_note_form">
            <Form.Item
              name="id"
              label="Note ID"
              rules={[{ required: true, message: 'Please input the note ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="Note Title"
              rules={[{ required: true, message: 'Please input the note title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="noteFile"
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

        {/* Delete Note Modal */}
        <Modal
          title="Confirm Deletion"
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <p>Do you want to delete this record?</p>
        </Modal>

        {/* View Note Modal */}
        <Modal
          title="View Note"
          visible={isViewModalVisible}
          footer={null}
          onCancel={() => setViewModalVisible(false)}
        >
          {fileUrl && <iframe src={fileUrl} style={{ width: '100%', height: '500px' }} />}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default CourseNotes;
