"use client";
import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

interface Course {
  sno: number;
  id: string;
  title: string;
  image?: File;
}

const initialCourseData: Course[] = [
  { sno: 1, id: 'course1', title: 'Chapter 1: Introduction' },
  { sno: 2, id: 'course2', title: 'Chapter 2: Basics' },
  // Add more courses as needed
];

interface CoursePageProps {
  params: {
    classId: string;
  };
}

const ClassCourses: React.FC<CoursePageProps> = ({ params }) => {
  const router = useRouter();
  const classId = params?.classId;
  const [courses, setCourses] = useState(initialCourseData);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isViewImageModalVisible, setViewImageModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [form] = Form.useForm();

  const handleAddLecture = (courseId: string) => {
    router.push(`/recorded-lectures/${classId}/${courseId}`);
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    form.resetFields();
    setFileList([]);
    setAddModalVisible(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    form.setFieldsValue({
      id: course.id,
      title: course.title,
    });
    setFileList(course.image ? [{ uid: '-1', name: course.image.name, status: 'done', url: URL.createObjectURL(course.image) }] : []);
    setEditModalVisible(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setDeleteModalVisible(true);
  };

  const handleViewImage = (course: Course) => {
    if (course.image) {
      setImageUrl(URL.createObjectURL(course.image));
      setViewImageModalVisible(true);
    } else {
      message.error('No image available to view.');
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCourse) {
      setCourses(courses.filter((course) => course.id !== selectedCourse.id));
      setDeleteModalVisible(false);
      setSelectedCourse(null);
    }
  };

  const handleConfirmAdd = () => {
    form.validateFields().then(values => {
      if (fileList.length === 0) {
        message.error('Please upload a course image!');
        return;
      }
      const newCourse: Course = {
        sno: courses.length + 1,
        image: fileList[0].originFileObj,
        ...values
      };
      setCourses([...courses, newCourse]);
      setAddModalVisible(false);
      setFileList([]);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleConfirmEdit = () => {
    form.validateFields().then(values => {
      if (selectedCourse) {
        const updatedCourse = {
          ...selectedCourse,
          ...values,
          image: fileList.length > 0 ? fileList[0].originFileObj : selectedCourse.image,
        };
        setCourses(courses.map(course => 
          course.id === selectedCourse.id ? updatedCourse : course
        ));
        setEditModalVisible(false);
        setSelectedCourse(null);
        setFileList([]);
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
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
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Course) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleAddLecture(record.id)}
            style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
          >
            Add Lectures
          </Button>
          <Button
            onClick={() => handleEditCourse(record)}
            style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)', color: 'white' }}
          >
            Edit
          </Button>
          <Button
            type="primary"
            onClick={() => handleDeleteCourse(record)}
            style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
          >
            Delete
          </Button>
          <Button
            type="link"
            onClick={() => handleViewImage(record)}
            style={{ color: 'rgb(28, 36, 52)' }}
          >
            View Image
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Class {classId} Courses</h1>
        <Button
          type="primary"
          className="mb-4"
          onClick={handleAddCourse}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Course
        </Button>
        <Table columns={columns} dataSource={courses} rowKey="id" />

        {/* Add Course Modal */}
        <Modal
          title="Add Course"
          visible={isAddModalVisible}
          onOk={handleConfirmAdd}
          onCancel={() => setAddModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="add_course_form">
            <Form.Item
              name="id"
              label="Course ID"
              rules={[{ required: true, message: 'Please input the course ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="Course Title"
              rules={[{ required: true, message: 'Please input the course title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="image"
              label="Upload Course Image"
              rules={[{ required: true, message: 'Please upload a course image!' }]}
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

        {/* Edit Course Modal */}
        <Modal
          title="Edit Course"
          visible={isEditModalVisible}
          onOk={handleConfirmEdit}
          onCancel={() => setEditModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="edit_course_form">
            <Form.Item
              name="id"
              label="Course ID"
              rules={[{ required: true, message: 'Please input the course ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="Course Title"
              rules={[{ required: true, message: 'Please input the course title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="image"
              label="Upload Course Image"
              rules={[{ required: true, message: 'Please upload a course image!' }]}
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

        {/* Delete Course Modal */}
        <Modal
          title="Confirm Deletion"
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <p>Do you want to delete this record?</p>
        </Modal>

        {/* View Image Modal */}
        <Modal
          title="View Course Image"
          visible={isViewImageModalVisible}
          footer={null}
          onCancel={() => setViewImageModalVisible(false)}
        >
          {imageUrl && <img src={imageUrl} alt="Course Image" style={{ width: '100%' }} />}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default ClassCourses;
