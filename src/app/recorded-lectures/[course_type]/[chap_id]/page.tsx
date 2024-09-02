"use client";

import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, message, Progress } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Lecture {
  lec_id: string;
  title: string;
  created_at: string;
  file_url: string;
  chapter_id: string;
}

interface AddLectureProps {
  params: {
    course_type: string;
    chap_id: string;
  };
}

const AddLecture: React.FC<AddLectureProps> = ({ params }) => {
  const router = useRouter();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);

  const [form] = Form.useForm();

  const accessToken = localStorage.getItem('access_token');
  const chapterId = parseInt(params.chap_id);

  useEffect(() => {
    if (chapterId) {
      fetchLectures();
    }
  }, [chapterId]);

  const fetchLectures = async () => {
    try {
      const response = await fetch('https://be.papersdock.com/lectures/get-all-lectures', {
        headers: {
          accesstoken: `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setLectures(data.data.filter((lecture: any) => lecture.chapter_id === chapterId));
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch lectures', error);
      message.error('Failed to fetch lectures');
    }
  };

  const handleAddLecture = () => {
    setSelectedLecture(null);
    form.resetFields();
    setFileList([]);
    setAddModalOpen(true);
  };

  const handleEditLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    form.setFieldsValue({
      lec_id: lecture.lec_id,
      title: lecture.title,
    });
    setFileList([]);
    setEditModalOpen(true);
  };

  const handleDeleteLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteDisabled(true);
    if (selectedLecture) {
      try {
        const response = await fetch('https://be.papersdock.com/lectures/delete-lecture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accesstoken: `Bearer ${accessToken}`,
            'x-api-key': 'lms_API',
          },
          body: JSON.stringify({ lec_id: selectedLecture.lec_id }),
        });
        const data = await response.json();
        if (response.ok) {
          setLectures(lectures.filter((lecture) => lecture.lec_id !== selectedLecture.lec_id));
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error('Failed to delete lecture', error);
        message.error('Failed to delete lecture');
      }
      setDeleteModalOpen(false);
      setSelectedLecture(null);
      setIsDeleteDisabled(false); // Re-enable button after completion
    }
  };

  const handleConfirmAdd = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    try {
      const values = await form.validateFields();
      const file = fileList[0]?.originFileObj;

      if (!file) {
        message.error('Please upload a lecture file!');
        return;
      }

      const CHUNK_SIZE = 1024 * 1024; // 1 MB
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const chapter_id = chapterId.toString();
      const title = values.title;
      const fileName = file.name.split('.');
      const fileNameExtension = fileName[fileName.length - 1];

      let uploadedChunks = 0;

      for (let chunkNumber = 1; chunkNumber <= totalChunks; chunkNumber++) {
        const start = (chunkNumber - 1) * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunk = file.slice(start, end);
        const formData = new FormData();

        formData.append('lecture', chunk);
        formData.append('chunkNumber', chunkNumber.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('fileName', file.name);
        formData.append('chapter_id', chapter_id);
        formData.append('title', title);
        formData.append('file_extension', fileNameExtension);
        formData.append('file_type', 'video');

        try {
          const response = await fetch('https://be.papersdock.com/lectures/create-lecture', {
            method: 'POST',
            headers: {
              accesstoken: `Bearer ${accessToken}`,
              'x-api-key': 'lms_API',
            },
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
          }

          // Update progress for each chunk
          uploadedChunks++;
          const progressPercent = Math.round((uploadedChunks / totalChunks) * 100);
          setUploadProgress(progressPercent);
        } catch (error) {
          message.error(`Failed to upload chunk ${chunkNumber}. Please try again.`);
          return;
        }
      }

      message.success('File uploaded successfully!');
      fetchLectures();
    } catch (error) {
      message.error('Failed to add lecture');
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
      setAddModalOpen(false);
      setFileList([]);
      setUploadProgress(100); // Ensure progress reaches 100%
    }
  };

  const handleConfirmEdit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedLecture) {
        const formData = new FormData();
        formData.append('lec_id', selectedLecture.lec_id);
        formData.append('chapter_id', chapterId.toString());
        formData.append('title', values.title);
        if (fileList.length > 0) {
          formData.append('file_type', 'video');
          formData.append('lecture', fileList[0].originFileObj);
        }

        const response = await fetch('https://be.papersdock.com/lectures/update-lecture', {
          method: 'POST',
          headers: {
            accesstoken: `Bearer ${accessToken}`,
            'x-api-key': 'lms_API',
          },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          message.success(data.message);
          fetchLectures();
        } else {
          message.error(data.message);
        }
      }
    } catch (error) {
      console.error('Failed to edit lecture', error);
      message.error('Failed to edit lecture');
    }
    setEditModalOpen(false);
    setSelectedLecture(null);
    setFileList([]);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
    setUploadProgress(0); // Reset the progress when a new file is selected
  };

  const handleViewLecture = (lecture: Lecture) => {
    setVideoUrl(`https://be.papersdock.com${lecture.file_url}`);
    setViewModalOpen(true);
  };

  const columns = [
    {
      title: 'Lecture ID',
      dataIndex: 'lec_id',
      key: 'lec_id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'View Lecture',
      key: 'file_url',
      render: (text: string, record: Lecture) => (
        <Button type="link" onClick={() => handleViewLecture(record)}>View Lecture</Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Lecture) => (
        <Space size="middle">
          <Button
            onClick={() => handleDeleteLecture(record)}
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
          <ArrowLeftOutlined onClick={() => router.back()} className="cursor-pointer" />
          <h1 className="text-3xl font-bold mb-8">Add Lectures</h1>
          <p>.</p>
        </div>
        <Button
          type="primary"
          className="mb-4"
          onClick={handleAddLecture}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Lecture
        </Button>
        <Table columns={columns} dataSource={lectures} rowKey="lec_id" />

        {/* Add Lecture Modal */}
        <Modal
          title="Add Lecture"
          open={isAddModalOpen}
          onOk={handleConfirmAdd}
          onCancel={() => setAddModalOpen(false)}
          okButtonProps={{
            disabled: isDisabled, // Disable OK button
            style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' },
          }}
          cancelButtonProps={{ disabled: isDisabled }}
        >
          <Form form={form} layout="vertical" name="add_lecture_form">
            <Form.Item
              name="title"
              label="Lecture Title"
              rules={[{ required: true, message: 'Please input the lecture title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lecture"
              label="Upload Lecture File"
              rules={[{ required: true, message: 'Please upload a lecture file!' }]}
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
          {uploadProgress > 0 && (
            <Progress percent={uploadProgress} status="active" />
          )}
        </Modal>

        {/* Edit Lecture Modal */}
        <Modal
          title="Edit Lecture"
          open={isEditModalOpen}
          onOk={handleConfirmEdit}
          onCancel={() => setEditModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="edit_lecture_form">
            <Form.Item
              name="title"
              label="Lecture Title"
              rules={[{ required: true, message: 'Please input the lecture title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lecture"
              label="Upload Lecture File"
              rules={[{ required: false, message: 'Please upload a lecture file!' }]}
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

        {/* Delete Lecture Modal */}
        <Modal
          title="Confirm Deletion"
          open={isDeleteModalOpen}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          confirmLoading={isDeleteDisabled}
          okButtonProps={{
            disabled: isDeleteDisabled,
            style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' },
          }}
        >
          <p>Do you want to delete this record?</p>
        </Modal>

        {/* View Lecture Modal */}
        <Modal
          title="View Lecture"
          open={isViewModalOpen}
          footer={null}
          onCancel={() => setViewModalOpen(false)}
        >
          {videoUrl && <video src={videoUrl} controls style={{ width: '100%' }} />}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default AddLecture;
