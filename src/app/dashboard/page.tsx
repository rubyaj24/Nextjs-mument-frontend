'use client'
import React, { useState, useEffect } from 'react'

import Header from '../components/dashboard/Header';
import SideBar from '../components/dashboard/SideBar';
import Profile from '../components/dashboard/Profile';
import Community from '../components/dashboard/Community'
import Updates from '../components/dashboard/Updates';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('profile');


  const dateRange = {
    start: new Date('2025-06-08'),
    end: new Date('2025-06-08')
  };
  
  // Set end date to 30 days after start date
  dateRange.end.setDate(dateRange.end.getDate() + 30);

  const currentDay = Math.ceil((new Date().getTime() - new Date('2025-06-08').getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));

  const currentWeek = Math.ceil(currentDay / 7);
  const totalWeeks = Math.ceil(totalDays / 7);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      
      // Close sidebar on mobile, open on desktop
      setIsSidebarOpen(!isMobile);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      case 'updates':
        return <Updates />;
      default:
        return <div className="text-center text-gray-500">Dashboard Home - Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header 
        toggleSidebar={toggleSidebar} 
        setActivePage={handleSetActivePage}
      />

      <div className="flex">
        {/* Sidebar */}
        <SideBar 
          isOpen={isSidebarOpen} 
          setActivePage={handleSetActivePage} 
          activePage={activePage}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className='flex justify-between'>
            <p className="mb-4 text-sm text-gray-600">Current page: <span className="text-blue-500 font-semibold">{activePage[0].toUpperCase() + activePage.slice(1)}</span></p>
            <p className="mb-4 text-sm text-gray-600">Day: {currentDay} of {totalDays}</p>
            <p className="mb-4 text-sm text-gray-600">Week: {currentWeek} of {totalWeeks}</p>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard