"use client";

import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, DatePicker, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Assignment {
  assignment_id: string;
  title: string;
  description: string;
  deadline: string;
  assignment_file: string;
  course_type: string;
}

interface AddAssignmentProps {
  params: {
    course_id: string;
    course_type: string;
  };
}

const AddAssignment: React.FC<AddAssignmentProps> = ({ params }) => {
  console.log(params)
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [form] = Form.useForm();
  const userData = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data') || '{}') : null;
  const accessToken = localStorage.getItem('access_token');
  const courseType = params.course_type
// console.log(userData.id, "userData")
console.log(courseType, "courseType")

  useEffect(() => {
    console.log("here")
    if (courseType) {
      fetchAssignments();
    }
  }, [courseType]);

  const fetchAssignments = async () => {
    try {
      console.log("here")
      const response = await fetch(`https://lms.papersdock.com/assignments/get-all-assignments-admin`, {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      console.log(data,"aaa")
      if (response.ok) {
        setAssignments(data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch assignments', error);
      message.error('Failed to fetch assignments');
    }
  };

  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    form.resetFields();
    setFileList([]);
    setAddModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    form.setFieldsValue({
      assignmentid: assignment.assignment_id,
      title: assignment.title,
      description: assignment.description,
      deadline: moment(assignment.deadline),
    });
    setFileList([]);
    setEditModalOpen(true);
  };

  const handleDeleteAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAssignment) {
      try {
        const response = await fetch('https://lms.papersdock.com/assignments/delete-assignment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accesstoken': `Bearer ${accessToken}`,
            'x-api-key': 'lms_API',
          },
          body: JSON.stringify({ assignment_id: selectedAssignment.assignment_id }),
        });
        const data = await response.json();
        if (response.ok) {
          setAssignments(assignments.filter((assignment) => assignment.assignment_id !== selectedAssignment.assignment_id));
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error('Failed to delete assignment', error);
        message.error('Failed to delete assignment');
      }
      setDeleteModalOpen(false);
      setSelectedAssignment(null);
    }
  };

  const handleConfirmAdd = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('course_type', courseType);
      formData.append('deadline', values.deadline.format('YYYY-MM-DD'));
      if (fileList.length > 0) {
        formData.append('assignment', fileList[0].originFileObj);
      }

      const response = await fetch('https://lms.papersdock.com/assignments/create-assignment', {
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
        fetchAssignments();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to add assignment', error);
      message.error('Failed to add assignment');
    }
    setAddModalOpen(false);
    setFileList([]);
  };

  const handleConfirmEdit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedAssignment) {
        const formData = new FormData();
        formData.append('assignment_id', selectedAssignment.assignment_id);
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('course_type', courseType);
        formData.append('deadline', values.deadline.format('YYYY-MM-DD'));
        if (fileList.length > 0) {
          formData.append('assignment', fileList[0].originFileObj);
        }

        const response = await fetch('https://lms.papersdock.com/assignments/update-assignment', {
          method: 'POST',
          headers: {
            'accesstoken': `Bearer ${accessToken}`,
            'x-api-key': 'lms_API',
          },
          body: formData,
        });

        const data = await response.json();
        console.log(data)
        if (response.ok) {
          message.success(data.message);
          fetchAssignments();
        } else {
          message.error(data.message);
        }
      }
    } catch (error) {
      console.error('Failed to edit assignment', error);
      message.error('Failed to edit assignment');
    }
    setEditModalOpen(false);
    setSelectedAssignment(null);
    setFileList([]);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleViewAssignment = (assignment: Assignment) => {
    setPdfUrl(`https://lms.papersdock.com${assignment.assignment_file}`);
    setViewModalOpen(true);
  };

  const columns = [
    {
      title: 'Assignment ID',
      dataIndex: 'assignment_id',
      key: 'assignment_id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'View Assignment',
      key: 'assignment_file',
      render: (text: string, record: Assignment) => (
        <Button type="link" onClick={() => handleViewAssignment(record)}>View Assignment</Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Assignment) => (
        <Space size="middle">
          <Button
            onClick={() => handleEditAssignment(record)}
            style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)', color: 'white' }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteAssignment(record)}
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
        <h1 className="text-3xl font-bold mb-8">Add Assignment</h1>
        <p>.</p>
        </div>
        <Button
          type="primary"
          className="mb-4"
          onClick={handleAddAssignment}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Assignment
        </Button>
        <Table columns={columns} dataSource={assignments} rowKey="assignmentid" />

        {/* Add Assignment Modal */}
        <Modal
          title="Add Assignment"
          open={isAddModalOpen}
          onOk={handleConfirmAdd}
          onCancel={() => setAddModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="add_assignment_form">
            <Form.Item
              name="title"
              label="Assignment Title"
              rules={[{ required: true, message: 'Please input the assignment title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Assignment Description"
              rules={[{ required: true, message: 'Please input the assignment description!' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="deadline"
              label="Deadline"
              rules={[{ required: true, message: 'Please select the deadline!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="assignment_file"
              label="Upload Assignment File"
              rules={[{ required: true, message: 'Please upload an assignment file!' }]}
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

        {/* Edit Assignment Modal */}
        <Modal
          title="Edit Assignment"
          open={isEditModalOpen}
          onOk={handleConfirmEdit}
          onCancel={() => setEditModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="edit_assignment_form">
            <Form.Item
              name="title"
              label="Assignment Title"
              rules={[{ required: true, message: 'Please input the assignment title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Assignment Description"
              rules={[{ required: true, message: 'Please input the assignment description!' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="deadline"
              label="Deadline"
              rules={[{ required: true, message: 'Please select the deadline!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="assignment_file"
              label="Upload Assignment File"
              rules={[{ required: false, message: 'Please upload an assignment file!' }]}
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

        {/* Delete Assignment Modal */}
        <Modal
          title="Confirm Deletion"
          open={isDeleteModalOpen}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <p>Do you want to delete this record?</p>
        </Modal>

        {/* View Assignment Modal */}
        <Modal
          title="View Assignment"
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

export default AddAssignment;
