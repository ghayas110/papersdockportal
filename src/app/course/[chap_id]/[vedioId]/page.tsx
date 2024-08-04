"use client"; // Mark this file as a Client Component

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React, { useState } from 'react';

interface VideoPageProps {
  params: {
    courseId: string;
    vedioId: string;
  };
}

interface Comment {
  user: {
    name: string;
    avatar: string;
  };
  text: string;
}

const VideoPage: React.FC<VideoPageProps> = ({ params }) => {
  console.log(params, "sss");

  // Sample data for demonstration
  const courseData = {
    id: params?.courseId,
    name: 'Mathematics',
    imageUrl: 'https://media.geeksforgeeks.org/wp-content/uploads/20230503013704/Mathematics-Banner.webp',
  };

  const videoData = {
    title: `Video ${params.vedioId} Title`,
    src: 'https://file-examples.com/storage/fe3f15b9da66a36baa1b51a/2017/04/file_example_MP4_480_1_5MG.mp4', // Replace with actual video URL
  };

  // State to manage comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Static user data for demonstration
      const user = {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40', // Replace with actual user avatar URL
      };
      setComments([...comments, { user, text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center">
          <div className="w-full rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h1 className="text-3xl font-bold mb-4">{courseData.name}</h1>
            <p className="text-base text-gray-600 mb-4">Course ID: {courseData.id}</p>
            <h2 className="text-2xl font-bold mb-4">{videoData.title}</h2>
            <div className="relative mb-6">
              <video
                className="w-full rounded-lg"
                controls
                src={videoData.src}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Comment Section */}
            <div className="w-full">
              <h3 className="text-xl font-bold mb-4">Comments</h3>
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  rows={4}
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </form>
              <div>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="border-b border-gray-200 py-2 flex items-start space-x-4">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={comment.user.avatar}
                        alt={comment.user.name}
                      />
                      <div>
                        <p className="font-bold">{comment.user.name}</p>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VideoPage;
