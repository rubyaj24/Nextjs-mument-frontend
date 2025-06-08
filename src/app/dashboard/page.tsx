'use client'
import React, { useState } from 'react'

import Header from '../components/dashboard/Header';
import SideBar from '../components/dashboard/SideBar';
import Profile from '../components/dashboard/Profile';
import Community from '../components/dashboard/Community'

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('profile');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSetActivePage = (page: string) => {
    console.log('Setting active page to:', page);
    setActivePage(page);
  };

  const renderContent = () => {
    console.log('Current active page:', activePage);
    switch (activePage) {
      case 'profile':
        return <Profile />;
      case 'community':
        return <Community />;
      default:
        return <div className="text-center text-gray-500">Dashboard Home - Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex">
        {/* Sidebar */}
        <SideBar isOpen={isSidebarOpen} setActivePage={handleSetActivePage} activePage={activePage} />

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="mb-4 text-sm text-gray-600">Current page: {activePage}</div>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard