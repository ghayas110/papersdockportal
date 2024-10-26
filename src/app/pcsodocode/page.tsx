// pages/index.tsx

"use client";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import ResizableLayout from '@/components/ResizableLayout';
import { DefaultContext } from 'react-icons';

const PseudoCode: React.FC = () => {
  return(
<DefaultLayout>

    <ResizableLayout />;
</DefaultLayout>
  ) 
};

export default PseudoCode;
