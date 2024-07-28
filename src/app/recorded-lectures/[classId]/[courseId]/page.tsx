"use client";
import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

interface Lecture {
  sno: number;
  id: string;
  title: string;
  date: string;
  videoFile?: File;
}

const initialLectureData: Lecture[] = [
  { sno: 1, id: 'lecture1', title: 'Lecture 1: Introduction', date: '2024-01-01' },
  { sno: 2, id: 'lecture2', title: 'Lecture 2: Advanced Topics', date: '2024-01-15' },
  // Add more lectures as needed
];

interface CoursePageProps {
  params: {
    classId: string;
    courseId: string;
  };
}

const CourseLectures: React.FC<CoursePageProps> = ({ params }) => {
  const router = useRouter();
  const courseId = params.courseId;
  const classId = params.classId;
  const [lectures, setLectures] = useState(initialLectureData);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [form] = Form.useForm();

  const handleAddLecture = () => {
    setSelectedLecture(null);
    form.resetFields();
    setFileList([]);
    setAddModalVisible(true);
  };

  const handleEditLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    form.setFieldsValue({
      id: lecture.id,
      title: lecture.title,
    });
    setFileList(lecture.videoFile ? [{ uid: '-1', name: lecture.videoFile.name, status: 'done', url: URL.createObjectURL(lecture.videoFile) }] : []);
    setEditModalVisible(true);
  };

  const handleDeleteLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedLecture) {
      setLectures(lectures.filter((lecture) => lecture.id !== selectedLecture.id));
      setDeleteModalVisible(false);
      setSelectedLecture(null);
    }
  };

  const handleConfirmAdd = () => {
    form.validateFields().then(values => {
      if (fileList.length === 0) {
        message.error('Please upload a video file!');
        return;
      }
      const newLecture: Lecture = {
        sno: lectures.length + 1,
        id: values.id,
        title: values.title,
        date: new Date().toISOString().split('T')[0],
        videoFile: fileList[0].originFileObj,
      };
      setLectures([...lectures, newLecture]);
      setAddModalVisible(false);
      setFileList([]);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleConfirmEdit = () => {
    form.validateFields().then(values => {
      if (selectedLecture) {
        const updatedLecture = {
          ...selectedLecture,
          id: values.id,
          title: values.title,
          date: new Date().toISOString().split('T')[0],
          videoFile: fileList.length > 0 ? fileList[0].originFileObj : selectedLecture.videoFile,
        };
        setLectures(lectures.map(lecture =>
          lecture.id === selectedLecture.id ? updatedLecture : lecture
        ));
        setEditModalVisible(false);
        setSelectedLecture(null);
        setFileList([]);
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleViewVideo = (lecture: Lecture) => {
    setVideoUrl(URL.createObjectURL(lecture.videoFile as File));
    setVideoModalVisible(true);
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
      title: 'Lecture Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'View Video',
      key: 'videoFile',
      render: (text: string, record: Lecture) => (
        <Button type="link" onClick={() => handleViewVideo(record)}>View Video</Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Lecture) => (
        <Space size="middle">
          <Button
            onClick={() => handleEditLecture(record)}
            style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)', color: 'white' }}
          >
            Edit
          </Button>
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
        <h1 className="text-3xl font-bold mb-8">Class {classId} - Course {courseId}</h1>
        <Button
          type="primary"
          className="mb-4"
          onClick={handleAddLecture}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Lecture
        </Button>
        <Table columns={columns} dataSource={lectures} rowKey="id" />

        {/* Add Lecture Modal */}
        <Modal
          title="Add Lecture"
          visible={isAddModalVisible}
          onOk={handleConfirmAdd}
          onCancel={() => setAddModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="add_lecture_form">
            <Form.Item
              name="id"
              label="Lecture ID"
              rules={[{ required: true, message: 'Please input the lecture ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="Lecture Title"
              rules={[{ required: true, message: 'Please input the lecture title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="videoFile"
              label="Upload Video File"
              rules={[{ required: true, message: 'Please upload a video file!' }]}
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

        {/* Edit Lecture Modal */}
        <Modal
          title="Edit Lecture"
          visible={isEditModalVisible}
          onOk={handleConfirmEdit}
          onCancel={() => setEditModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="edit_lecture_form">
            <Form.Item
              name="id"
              label="Lecture ID"
              rules={[{ required: true, message: 'Please input the lecture ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="Lecture Title"
              rules={[{ required: true, message: 'Please input the lecture title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="videoFile"
              label="Upload Video File"
              rules={[{ required: true, message: 'Please upload a video file!' }]}
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
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <p>Do you want to delete this record?</p>
        </Modal>

        {/* Video Modal */}
        <Modal
          title="View Video"
          visible={isVideoModalVisible}
          footer={null}
          onCancel={() => setVideoModalVisible(false)}
        >
          {videoUrl && <video src={videoUrl} controls style={{ width: '100%' }} />}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default CourseLectures;
