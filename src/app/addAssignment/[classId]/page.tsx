"use client";
import { useRouter } from 'next/navigation';
import { Table, Button, Space, Modal, Form, Input, Upload, DatePicker, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Assignment {
  sno: number;
  id: string;
  title: string;
  date: string;
  deadline: string;
  assignmentFile?: File;
}

const initialAssignmentData: Assignment[] = [
  { sno: 1, id: 'assignment1', title: 'Assignment 1: Introduction', date: '2024-01-01', deadline: '2024-02-01' },
  { sno: 2, id: 'assignment2', title: 'Assignment 2: Advanced Topics', date: '2024-01-15', deadline: '2024-02-15' },
  // Add more assignments as needed
];

interface CoursePageProps {
  params: {
    classId: string;
    courseId: string;
  };
}

const CourseAssignments: React.FC<CoursePageProps> = ({ params }) => {
  const router = useRouter();
  const courseId = params.courseId;
  const classId = params.classId;
  const [assignments, setAssignments] = useState(initialAssignmentData);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [form] = Form.useForm();

  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    form.resetFields();
    setFileList([]);
    setAddModalVisible(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    form.setFieldsValue({
      id: assignment.id,
      title: assignment.title,
      deadline: moment(assignment.deadline),
    });
    setFileList(assignment.assignmentFile ? [{ uid: '-1', name: assignment.assignmentFile.name, status: 'done', url: URL.createObjectURL(assignment.assignmentFile) }] : []);
    setEditModalVisible(true);
  };

  const handleDeleteAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAssignment) {
      setAssignments(assignments.filter((assignment) => assignment.id !== selectedAssignment.id));
      setDeleteModalVisible(false);
      setSelectedAssignment(null);
    }
  };

  const handleConfirmAdd = () => {
    form.validateFields().then(values => {
      if (fileList.length === 0) {
        message.error('Please upload an assignment file!');
        return;
      }
      const newAssignment: Assignment = {
        sno: assignments.length + 1,
        id: values.id,
        title: values.title,
        date: new Date().toISOString().split('T')[0],
        deadline: values.deadline.format('YYYY-MM-DD'),
        assignmentFile: fileList[0].originFileObj,
      };
      setAssignments([...assignments, newAssignment]);
      setAddModalVisible(false);
      setFileList([]);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleConfirmEdit = () => {
    form.validateFields().then(values => {
      if (selectedAssignment) {
        const updatedAssignment = {
          ...selectedAssignment,
          id: values.id,
          title: values.title,
          date: new Date().toISOString().split('T')[0],
          deadline: values.deadline.format('YYYY-MM-DD'),
          assignmentFile: fileList.length > 0 ? fileList[0].originFileObj : selectedAssignment.assignmentFile,
        };
        setAssignments(assignments.map(assignment =>
          assignment.id === selectedAssignment.id ? updatedAssignment : assignment
        ));
        setEditModalVisible(false);
        setSelectedAssignment(null);
        setFileList([]);
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleViewAssignment = (assignment: Assignment) => {
    setFileUrl(URL.createObjectURL(assignment.assignmentFile as File));
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
      title: 'Assignment Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'View Assignment',
      key: 'assignmentFile',
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
        <h1 className="text-3xl font-bold mb-8">Class {classId} - Assignment</h1>
        <Button
          type="primary"
          className="mb-4"
          onClick={handleAddAssignment}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          Add Assignment
        </Button>
        <Table columns={columns} dataSource={assignments} rowKey="id" />

        {/* Add Assignment Modal */}
        <Modal
          title="Add Assignment"
          visible={isAddModalVisible}
          onOk={handleConfirmAdd}
          onCancel={() => setAddModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="add_assignment_form">
            <Form.Item
              name="id"
              label="Assignment ID"
              rules={[{ required: true, message: 'Please input the assignment ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="Assignment Title"
              rules={[{ required: true, message: 'Please input the assignment title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="deadline"
              label="Deadline"
              rules={[{ required: true, message: 'Please select the deadline!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="assignmentFile"
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
          visible={isEditModalVisible}
          onOk={handleConfirmEdit}
          onCancel={() => setEditModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <Form form={form} layout="vertical" name="edit_assignment_form">
            <Form.Item
              name="id"
              label="Assignment ID"
              rules={[{ required: true, message: 'Please input the assignment ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="Assignment Title"
              rules={[{ required: true, message: 'Please input the assignment title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="deadline"
              label="Deadline"
              rules={[{ required: true, message: 'Please select the deadline!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="assignmentFile"
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

        {/* Delete Assignment Modal */}
        <Modal
          title="Confirm Deletion"
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' } }}
        >
          <p>Do you want to delete this record?</p>
        </Modal>

        {/* View Assignment Modal */}
        <Modal
          title="View Assignment"
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

export default CourseAssignments;
