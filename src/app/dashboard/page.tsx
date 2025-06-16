'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import Header from '../components/dashboard/Header';
import SideBar from '../components/dashboard/SideBar';
import Profile from '../components/dashboard/Profile';
import Community from '../components/dashboard/Community'
import Updates from '../components/dashboard/Updates';
import Overlay from '../components/dashboard/Overlay';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import UserUpdates from '../components/dashboard/UserUpdates';
import Checkpoints from '../components/dashboard/Checkpoints';


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('profile');
  const [showOverlay, setShowOverlay] = useState(false);
  const [profile, setProfile] = useState<{ img_url?: string; name?: string } | undefined>(undefined);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();

  // Improved project date logic
  const projectStartDate = new Date('2025-06-08');
  const projectEndDate = new Date('2025-07-08'); // 30 days after start
  
  // Calculate current day and week
  const getCurrentDayAndWeek = () => {
    const today = new Date();
    
    // Before project starts
    if (today < projectStartDate) {
      return { currentDay: 0, currentWeek: 0, totalDays: 30, totalWeeks: 4 };
    }
    
    // After project ends
    if (today > projectEndDate) {
      return { currentDay: 30, currentWeek: 4, totalDays: 30, totalWeeks: 4 };
    }
    
    // During project
    const dayDiff = Math.floor((today.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const weekDiff = Math.ceil(dayDiff / 7);
    
    return {
      currentDay: dayDiff,
      currentWeek: weekDiff,
      totalDays: 30,
      totalWeeks: 4
    };
  };
  
  const { currentDay, currentWeek, totalDays, totalWeeks } = getCurrentDayAndWeek();

  // Weekly overlay logic
  useEffect(() => {
    // Check if user is logged in and determine if overlay should be shown based on the week
    const checkAndShowOverlay = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (!isAuthenticated || isAuthenticated !== 'true') {
        return;
      }
      
      // Get the last week when overlay was shown
      const lastOverlayWeek = localStorage.getItem('lastOverlayWeek');
      
      // Show overlay if:
      // 1. We're in a valid project week (1-4)
      // 2. User has never seen overlay or we're in a new week compared to last time
      if (
        currentWeek > 0 && 
        currentWeek <= totalWeeks && 
        (!lastOverlayWeek || parseInt(lastOverlayWeek) < currentWeek)
      ) {
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
      }
    };

    // Function to handle window resize
    // const handleResize = () => {
    //   const isMobile = window.innerWidth < 768;
      
    //   // Close sidebar on mobile, open on desktop
    //   setIsSidebarOpen(!isMobile);
    // };

    // handleResize();

    checkAndShowOverlay();
  }, [currentWeek, totalWeeks]);

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
    // Store the current week number to track when the overlay was last shown
    localStorage.setItem('lastOverlayWeek', currentWeek.toString());
  };

  // Update overlay content based on week number
  const getWeeklyMessage = () => {
    if (currentWeek === 1) {
      return {
        title: "Welcome to Your 30-Day Journey!",
        message: "You're starting your first week. Set your goals and get ready!"
      };
    } else {
      return {
        title: `Congrats! You've completed Week ${currentWeek - 1}`,
        message: `${totalWeeks - currentWeek + 1} weeks to go. Share your progress in Checkpoints!`
      };
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'profile':
        return <Profile profile={profile} loading={profileLoading} error={profileError} />;
      case 'community':
        return <Community />;
      case 'updates':
        return <Updates />;
      case 'checkpoints':
        return <Checkpoints />;
        case 'user-updates':
        return <UserUpdates />;
      default:
        return <div className="text-center text-gray-500">Dashboard Home - Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overlay with dynamic content based on week */}
      <Overlay isVisible={showOverlay} onClose={handleCloseOverlay}>
        <h1 className='text-2xl font-bold'>{getWeeklyMessage().title}</h1>
        <Image
          src="Personal goals-bro.svg"
          alt="Weekly progress image"
          width={500}
          height={300}
          className="h-92"
        />
        <p className='text-gray-600 text-center'>{getWeeklyMessage().message}</p>
      </Overlay>
      {/* Header */}
      <Header 
        toggleSidebar={toggleSidebar} 
        setActivePage={handleSetActivePage}
        userData={profile}
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