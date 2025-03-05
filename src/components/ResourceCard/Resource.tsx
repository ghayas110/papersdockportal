import React from 'react';

interface ResourceCardProps {
  notesId: string;
  title: string;
  viewNotesUrl: string;
  desc: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, notesId, viewNotesUrl, desc }) => {
  return (
    <div
      className="relative bg-gradient-to-b from-[#628EA2] to-[#1C3A50] shadow-lg text-center mx-auto mt-14 p-6 flex flex-col justify-between 
      w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg rounded-[45px] min-h-[260px] md:min-h-[280px] lg:min-h-[300px] px-8"
    >
      {/* Top Circle with Title (P1) */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 bg-[#19374D] text-white text-3xl md:text-4xl font-bold rounded-full flex items-center justify-center">
        {title.toUpperCase()}
      </div>

      {/* Main Content */}
      <div className="mt-14 md:mt-16 text-white text-lg md:text-xl font-semibold flex-grow">
        <h3 className="text-center text-xl md:text-2xl">{desc}</h3>
      </div>

      {/* Button */}
      <a
        href={`/viewNotes/${notesId}`}
        className="inline-block mt-6 md:mt-8 bg-white text-[#1c1c1c] hover:bg-gray-300 font-bold py-2 px-5 md:px-6 rounded-full transition duration-300"
      >
        View Notes
      </a>
    </div>
  );
};

export default ResourceCard;
