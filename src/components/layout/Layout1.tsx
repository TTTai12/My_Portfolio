// src/components/layout/Layout.tsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // Sử dụng Fragment <>...</> để bao bọc các element
    <>
      <Navbar />
      <main>
        {children} {/* Nơi chứa tất cả các section chính (Hero, About, Projects, Contact) */}
      </main>
      <Footer /> {/* SỬ DỤNG component Footer đã import */}
    </>
  );
};

export default Layout;