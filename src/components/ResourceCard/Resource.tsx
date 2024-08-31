import React from 'react';

interface ResourceCardProps {
  notesId: string;
  image: string;
  title: string;
  viewNotesUrl: string;

}

const ResourceCard: React.FC<ResourceCardProps> = ({ image, title, viewNotesUrl }) => {
  return (
    <div style={{backgroundColor:'#1c1c1c'}} className="max-w-lg rounded overflow-hidden shadow-lg m-4">
      <div className="w-full h-48 overflow-hidden">
        <img className="w-full h-full object-cover" src={image} alt={title} />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-white">{title.toUpperCase()}</div>
        <div className="mt-4 flex space-x-4">

      
        <div className="mt-4 flex">
          <a
            href={`/viewNotes/${title}`}
            
          
            className="bg-[rgb(28,36,52)] hover:bg-opacity-90 text-white font-bold py-2 px-8 rounded"
          >
            View Notes
          </a>
       
        </div>
      
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
