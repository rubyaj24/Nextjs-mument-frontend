'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import Header from '../components/dashboard/Header';
import SideBar from '../components/dashboard/SideBar';
import Profile from '../components/dashboard/Profile';
import Community from '../components/dashboard/Community'
import Updates from '../components/dashboard/Updates';
import WeeklyUpdates from '../components/dashboard/WeeklyUpdates';
import Overlay from '../components/dashboard/Overlay';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import UserUpdates from '../components/dashboard/UserUpdates';


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('profile');
  const [showOverlay, setShowOverlay] = useState(false);
  const [profile, setProfile] = useState<{ img_url?: string; name?: string } | undefined>(undefined);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();

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

 
  useEffect(() => {

    setShowOverlay(true);

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 1 }
    });
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 1 }
    });

    // Automatically close the overlay after 3 seconds
    const overlayTimeout = setTimeout(() => {
      setShowOverlay(false);
    }, 3000);

    // Function to handle window resize
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      
      // Close sidebar on mobile, open on desktop
      setIsSidebarOpen(!isMobile);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(overlayTimeout);
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in and overlay hasn't been shown yet
    const checkAndShowOverlay = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn'); // or your auth state
      const overlayShown = localStorage.getItem('welcomeOverlayShown');
      
      // Show overlay only if user is logged in and overlay hasn't been shown
      if (isLoggedIn && !overlayShown) {
        setShowOverlay(true);
      }
    };

    checkAndShowOverlay();
  }, []);

  // Fetch profile data once in Dashboard
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const token = localStorage.getItem('token');
        
        if (!isAuthenticated || isAuthenticated !== 'true' || !token) {
          router.push('/signin');
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/details/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setProfile(response.data);
        setProfileLoading(false);
        setProfileError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userEmail');
          router.push('/signin');
        } else {
          setProfileLoading(false);
          setProfileError('Error fetching profile');
          console.error('Error fetching profile:', err);
        }
      }
    };

    fetchProfile();
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSetActivePage = (page: string) => {
    console.log('Setting active page to:', page);
    setActivePage(page);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    // Mark overlay as shown so it won't appear again
    localStorage.setItem('welcomeOverlayShown', 'true');
  };

  const renderContent = () => {
        return <Profile profile={profile} loading={profileLoading} error={profileError} />;
    switch (activePage) {
      case 'profile':
        return <Profile profile={profile} loading={profileLoading} error={profileError} />;
      case 'community':
        return <Community />;
      case 'updates':
        return <Updates />;
      case 'weekly-updates':
        return <WeeklyUpdates />;
        case 'user-updates':
        return <UserUpdates />;
      default:
        return <div className="text-center text-gray-500">Dashboard Home - Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overlay */}
      <Overlay isVisible={showOverlay} onClose={handleCloseOverlay}>
        <h1 className='text-2xl font-bold'>Congrats, You&apos;ve completed <span className='text-4xl text-blue-500'>Week {currentWeek-1}</span></h1>
        <Image
          src="Personal goals-bro.svg"
          alt="Congrats Image"
          width={500}
          height={300}
          className="h-92"
        />
        <p className='text-gray-600 text-center'>Tell us more, in Weekly updates</p>
      </Overlay>
      {/* Header */}
      <Header 
        toggleSidebar={toggleSidebar} 
        setActivePage={handleSetActivePage}
        profile={profile}
        profileLoading={profileLoading}
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