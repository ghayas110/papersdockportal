// components/ResizableLayout.tsx
"use client";
import React, { useState } from 'react';
import CodeEditor from './CodeEditor/page';
import Sidebar from './SideBars/page';

const ResizableLayout: React.FC = () => {
  const [editorWidth, setEditorWidth] = useState<number>(50);

  const handleDrag = (e: MouseEvent) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setEditorWidth(newWidth);
    }
  };

  const startDragging = () => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener(
      'mouseup',
      () => {
        document.removeEventListener('mousemove', handleDrag);
      },
      { once: true }
    );
  };

  return (
    <div className="flex" >
      <div
        className="flex-shrink-0"
        style={{ width: '100%' }}
      >
        <CodeEditor />
      </div>
      
    
    </div>
  );
};

export default ResizableLayout;
