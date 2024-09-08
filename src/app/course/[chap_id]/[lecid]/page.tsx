"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, message } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import ReactPlayer from 'react-player';
import { useParams } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';



interface Lecture {
  lec_id: string;
  chapter_id: string;
  title: string;
  duration: string;
  file_type: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

interface VideoViewProps {
  params: {
    chap_id: string;
    lecid: string;
  };
}

const VideoView: React.FC<VideoViewProps> = ({ params }) => {

  const lec_id = parseInt(params.lecid);
  const router = useRouter();
  console.log(params)

  const [lecture, setLecture] = useState<Lecture | null>(null);

  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (lec_id) {
      fetchLecture();
    }
  }, [lec_id]);

  const fetchLecture = async () => {
    try {
      const response = await fetch(`https://be.papersdock.com/lectures/get-lecture-by-Id/${lec_id}`, {
        headers: {
          'accesstoken': `Bearer ${accessToken}`,
          'x-api-key': 'lms_API',
        },
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setLecture(data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch lecture', error);
      message.error('Failed to fetch lecture');
    }
  };
  let devToolsOpen = false;

  const detectDevTools = () => {
    const threshold = 160; // Threshold for detecting dev tools
  
    if (
      window.outerWidth - window.innerWidth > threshold || 
      window.outerHeight - window.innerHeight > threshold
    ) {
      if (!devToolsOpen) {
        devToolsOpen = true;
    
        router.push('/');
        message.error('Dev tools detected. Please Do not use SevTools on Lecture View.');
      }
    } else {
      devToolsOpen = false;
    }
  };
  
  // Continuously check for dev tools every second
  setInterval(() => {
    detectDevTools();
  }, 1000);
  useEffect(() => {
    const handleContextMenu = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        {lecture ? (
          <>
            <div className="mb-8"  onContextMenu={(e) => e.preventDefault()}>
            <div className="flex justify-between">
        <ArrowLeftOutlined onClick={() => router.back()} className="cursor-pointer"/>
        <h1 className="text-3xl font-bold mb-8">{lecture.title}</h1>
        <p>.</p>
        </div>
             
            </div>
            <div className="video-wrapper">
            <video src={`https://be.papersdock.com${lecture.file_url}`} controls   onContextMenu={(e) => e.preventDefault()}  // Prevent right-click
      controlsList="nodownload"  // Add 'nodownload' attribute to HTML5 video controls
           />
            </div>
          </>
        ) : (
          <p>Loading lecture information...</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default VideoView;
