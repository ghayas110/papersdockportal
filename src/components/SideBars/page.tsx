// components/Sidebar.tsx
"use client";
import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-900 text-gray-300 p-4 h-full w-1/2 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
      <p>This is the sidebar content.</p> 
    </div>
  );
};

export default Sidebar;
