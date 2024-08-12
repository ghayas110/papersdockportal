import React from 'react';

interface NotesCardProps {
  notesId: string;
  image: string;
  title: string;
  viewNotesUrl: string;
  downloadNotesUrl: string;
}

const NotesCard: React.FC<NotesCardProps> = ({ image, title, viewNotesUrl, downloadNotesUrl }) => {
  return (
    <div className="max-w-lg rounded overflow-hidden shadow-lg bg-white m-4">
      <div className="w-full h-48 overflow-hidden">
        <img className="w-full h-full object-cover" src={image} alt={title} />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <div className="mt-4 flex space-x-4">
          <a
            href={viewNotesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[rgb(28,36,52)] hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
          >
            View Notes
          </a>
       
        </div>
      </div>
    </div>
  );
};

export default NotesCard;
