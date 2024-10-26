// components/Sidebar.tsx
"use client";
import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-900 text-gray-300 p-4 h-full w-1/2 overflow-auto">
      <h2 className="text-lg font-bold mb-4">File Contents</h2>
      <p>
        You can manually create a file using the "new file" button, or create a file in your programs using a combination of the OPENFILE and WRITEFILE operations.
      </p>
      <p className="mt-4">
        You can also open files in new tabs, download or delete them too. Dragging & dropping either .pseudo code files or text-based files for the file manager is also possible.
      </p>
    </div>
  );
};

export default Sidebar;
