// components/NotesCard.tsx
import Link from 'next/link';
import React from 'react';

interface NotesCardProps {
  notesId: string;
  image: string;
  title: string;
  viewNotesUrl: string;
  downloadNotesUrl: string;
}

const NotesCard: React.FC<NotesCardProps> = ({ notesId, image, title, viewNotesUrl, downloadNotesUrl }) => {
  return (
    <div className="max-w-lg rounded overflow-hidden shadow-lg bg-white m-4">
      <img className="w-full" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">Class ID: {notesId}</p>
        <div className="mt-4 flex space-x-4">
         
            
              <button
                className="bg-[rgb(28,36,52)] hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
              >
                View Notes
              </button>
           
   
      
          
              <button
                className="bg-[rgb(28,36,52)] hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
              >
                Download Notes
              </button>
          
         
        </div>
      </div>
    </div>
  );
};

export default NotesCard;
