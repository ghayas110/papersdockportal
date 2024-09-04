import React from 'react';

interface ResourceCardProps {
  notesId: string;
  title: string;
  viewNotesUrl: string;
  desc: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title,notesId, viewNotesUrl, desc }) => {
  return (
    <div
      style={{ borderRadius: '45px', width: '300px', height: '300px' }} // Set fixed width and height
      className="relative bg-gradient-to-b from-[#628EA2] to-[#1C3A50] shadow-lg text-center mx-auto mt-8 p-10 flex flex-col justify-between"
    >
      {/* Top Circle with Title (P1) */}
      <div className="absolute top-[-60px] left-1/2 transform -translate-x-1/2 w-34 h-34 bg-[#19374D] text-white text-5xl font-bold rounded-full flex items-center justify-center">
        {title.toUpperCase()}
      </div>

      {/* Main Content */}
      <div className="mt-16 text-white text-xl font-semibold flex-grow">
        <h3 className="text-center text-2xl">
          {desc}
        </h3>
      </div>

      {/* Button */}
      <a
           href={`/viewNotes/${notesId}`}
        className="inline-block mt-8 bg-white text-[#1c1c1c] hover:bg-gray-300 font-bold py-2 px-6 rounded-full"
      >
        View Notes
      </a>
    </div>
  );
};

export default ResourceCard;
