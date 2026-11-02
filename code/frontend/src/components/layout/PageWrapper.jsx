import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { SlideUp } from '../AnimatedWrapper';

const PageWrapper = ({ children }) => {
  return (
    <div className="flex bg-background-dark min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="pt-28 pb-20 px-10 transition-all duration-500 relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
