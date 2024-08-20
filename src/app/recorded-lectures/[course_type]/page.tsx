"use client";

import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';

interface Chapter {
  chap_id: string;
  chapter_name: string;
  chapter_image_url: string;
  course_type: string;
}

interface AddCourseProps {
  params: {
    course_type: string;
  };
}

const AddCourse: React.FC<AddCourseProps> = ({ params }) => {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isAddLoading, setAddLoading] = useState(false);
  const [isEditLoading, setEditLoading] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [form] = Form.useForm();

  const accessToken = localStorage.getItem('access_token');
  const courseType = params.course_type;

  useEffect(() => {
    if (courseType) {
      fetchChapters();
    }
  }, [courseType]);

  const fetchChapters = async () => {
    try {
      const response = await fetch('https://lms.papersdock.com/chapters/get-all-chapters', {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setChapters(courseType !== "Both" ? data.data.filter((chapter: any) => chapter.course_type === courseType) : data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch chapters', error);
      message.error('Failed to fetch chapters');
    }
  };

  const handleAddChapter = () => {
    setSelectedChapter(null);
    form.resetFields();
    setFileList([]);
    setAddModalOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    form.setFieldsValue({
      chapter_name: chapter.chapter_name,
    });

    // Set the existing image to fileList
    setFileList([{
      uid: '-1', // A unique identifier
      name: chapter.chapter_image_url.split('/').pop(), // Image file name
      status: 'done', // Set the status to done to show the image in preview
      url: `https://lms.papersdock.com${chapter.chapter_image_url}`, // Full URL of the image
    }]);

    setEditModalOpen(true);
  };

  const handleDeleteChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedChapter) {
      setDeleteLoading(true);
      try {
        const response = await fetch('https://lms.papersdock.com/chapters/delete-chapter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accesstoken': `Bearer ${accessToken}`,
            'x-api-key': 'lms_API',
          },
          body: JSON.stringify({ chap_id: selectedChapter.chap_id }),
        });
        const data = await response.json();
        if (response.ok) {
          setChapters(chapters.filter((chapter) => chapter.chap_id !== selectedChapter.chap_id));
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error('Failed to delete chapter', error);
        message.error('Failed to delete chapter');
      }
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setSelectedChapter(null);
    }
  };

  const handleConfirmAdd = async () => {
    try {
      const values = await form.validateFields();
      setAddLoading(true);
      const formData = new FormData();
      formData.append('course_type', courseType);
      formData.append('chapter_name', values.chapter_name);
      if (fileList.length > 0) {
        formData.append('chapter-image', fileList[0].originFileObj);
      }

      const response = await fetch('https://lms.papersdock.com/chapters/create-chapter', {
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
        fetchChapters();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to add chapter', error);
      message.error('Failed to add chapter');
    }
    setAddLoading(false);
    setAddModalOpen(false);
    setFileList([]);
  };

  const handleConfirmEdit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedChapter) {
        setEditLoading(true);
        const formData = new FormData();
        formData.append('chap_id', selectedChapter.chap_id);
        formData.append('course_type', courseType);
        formData.append('chapter_name', values.chapter_name);

        if (fileList.length > 0) {
          formData.append('chapter-image', fileList[0].originFileObj);
        }

        const response = await fetch('https://lms.papersdock.com/chapters/update-chapter', {
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
          fetchChapters();
        } else {
          message.error(data.message);
        }
      }
    } catch (error) {
      console.error('Failed to edit chapter', error);
      message.error('Failed to edit chapter');
    }
    setEditLoading(false);
    setEditModalOpen(false);
    setSelectedChapter(null);
    setFileList([]);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleViewImage = (chapter: Chapter) => {
    setImageUrl(`https://lms.papersdock.com${chapter.chapter_image_url}`);
    setViewModalOpen(true);
  };

  const columns = [
    {
      title: 'Chapter ID',
      dataIndex: 'chap_id',
      key: 'chap_id',
    },
    {
      title: 'Chapter Name',
      dataIndex: 'chapter_name',
      key: 'chapter_name',
    },
    {
      title: 'View Chapter Image',
      key: 'chapter_image_url',
      render: (text: string, record: Chapter) => (
        <Button type="link" onClick={() => handleViewImage(record)}>View Image</Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Chapter) => (
        <Space size="middle">
          <Button
            onClick={() => handleEditChapter(record)}
            style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)', color: 'white' }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteChapter(record)}
            style={{ color: 'red', borderColor: 'rgb(28, 36, 52)' }}
          >
            Delete
          </Button>
          <Button
            onClick={() => router.push(`/recorded-lectures/${courseType}/${record.chap_id}`)}
            style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)', color: 'white' }}
          >
            Add Lecture
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
          <h1 className="text-3xl font-bold mb-8">Add Course</h1>
          <p>.</p>
        </div>
        <Button
          type="primary"
          className="mb-4"
          onClick={handleAddChapter}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Chapter
        </Button>
        <Table columns={columns} dataSource={chapters} rowKey="chap_id" />

        {/* Add Chapter Modal */}
        <Modal
          title="Add Chapter"
          open={isAddModalOpen}
          onOk={handleConfirmAdd}
          onCancel={() => setAddModalOpen(false)}
          confirmLoading={isAddLoading}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="add_chapter_form">
            <Form.Item
              name="chapter_name"
              label="Chapter Name"
              rules={[{ required: true, message: 'Please input the chapter name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="chapter_image"
              label="Upload Chapter Image"
              rules={[{ required: true, message: 'Please upload a chapter image!' }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                fileList={fileList}
                listType="picture"
                onPreview={file => {
                  window.open(file.url || file.thumbUrl, '_blank');
                }}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Chapter Modal */}
        <Modal
          title="Edit Chapter"
          open={isEditModalOpen}
          onOk={handleConfirmEdit}
          confirmLoading={isEditLoading}
          onCancel={() => setEditModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="edit_chapter_form">
            <Form.Item
              name="chapter_name"
              label="Chapter Name"
              rules={[{ required: true, message: 'Please input the chapter name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="chapter_image"
              label="Upload Chapter Image"
              rules={[{ required: false, message: 'Please upload a chapter image!' }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleUploadChange}
                fileList={fileList}
                listType="picture"
                onPreview={file => {
                  window.open(file.url || file.thumbUrl, '_blank');
                }}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Chapter Modal */}
        <Modal
          title="Confirm Deletion"
          open={isDeleteModalOpen}
          onOk={handleConfirmDelete}
          confirmLoading={isDeleteLoading}
          onCancel={() => setDeleteModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <p>Do you want to delete this record?</p>
        </Modal>

        {/* View Chapter Image Modal */}
        <Modal
          title="View Chapter Image"
          open={isViewModalOpen}
          footer={null}
          onCancel={() => setViewModalOpen(false)}
        >
          {imageUrl && <img src={imageUrl} alt="Chapter Image" style={{ width: '100%' }} />}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default AddCourse;
