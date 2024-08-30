"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import moment from 'moment';
import Image from 'next/image';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface Lecture {
  lec_id: string;
  title: string;
  duration: string;
  file_url: string;
  created_at: string;
}

interface Chapter {
  chap_id: string;
  course_type: string;
  chapter_name: string;
  chapter_image_url: string;
  created_at: string;
  updated_at: string;
}

interface LectureViewProps {
  params: {
    chap_id: string;
  };
}

const LectureView: React.FC<LectureViewProps> = ({ params }) => {
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem('access_token');
  const chapterId = parseInt(params.chap_id);

  useEffect(() => {
    fetchChapterInfo();
    fetchLectures();
  }, [chapterId]);

  const fetchChapterInfo = async () => {
    try {
      const response = await fetch(`http://be.papersdock.com/chapters/get-chapter-by-Id/${chapterId}`, {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setChapter(data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch chapter info', error);
      message.error('Failed to fetch chapter info');
    }
  };

  const fetchLectures = async () => {
    try {
      const response = await fetch('http://be.papersdock.com/lectures/get-all-lectures', {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setLectures(data.data.filter((lecture: any) => lecture?.chapter_id === chapterId));
      } else {
        message.error(data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch lectures', error);
      message.error('Failed to fetch lectures');
      setLoading(false);
    }
  };

  const handleViewLecture = (lecId: string) => {
    router.push(`/course/${chapterId}/${lecId}`);
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
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Lecture) => (
        <Button
          type="primary"
          onClick={() => handleViewLecture(record.lec_id)}
          style={{ backgroundColor: 'rgb(28, 36, 52)', borderColor: 'rgb(28, 36, 52)' }}
        >
          View Lecture
        </Button>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
      {chapter && (
      <div className="flex justify-between">
        <ArrowLeftOutlined onClick={() => router.back()} className="cursor-pointer"/>
        <h1 className="text-3xl font-bold">{chapter.chapter_name}</h1>
        <p>.</p>
        </div>
   
        )}
        <Table
          columns={columns}
          dataSource={lectures}
          rowKey="lec_id"
          loading={loading}
        />
      </div>
    </DefaultLayout>
  );
};

export default LectureView;
