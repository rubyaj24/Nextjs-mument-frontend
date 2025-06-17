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
import { FaLightbulb, FaUsers, FaFlagCheckered } from 'react-icons/fa';


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('profile');
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
  const [showGuideOverlay, setShowGuideOverlay] = useState(false);
  const [profile, setProfile] = useState<{ img_url?: string; name?: string } | undefined>(undefined);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();

  // project date logic
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
        setShowWelcomeOverlay(true);
        
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

  const handleCloseWelcome = () => {
    setShowWelcomeOverlay(false);
    // Store the current week number to track when the overlay was last shown
    localStorage.setItem('lastOverlayWeek', currentWeek.toString());
  };

  const handleCloseGuide = () => {
    setShowGuideOverlay(false);
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
      {/* Welcome Overlay */}
      <Overlay isVisible={showWelcomeOverlay} onClose={handleCloseWelcome}>
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

      {/* Guide Overlay */}
      <Overlay isVisible={showGuideOverlay} onClose={handleCloseGuide}>
        <h1 className='text-3xl font-bold text-center mb-6'><Image src="/mument-black.png" alt="Logo" width={100} height={100} className='inline-block w-28 pt-1' /><span className='text-gray-800'> |</span> User Guide</h1>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaFlagCheckered className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Checkpoints</h3>
                  <p className="mt-1 text-gray-600">Submit your Weekly checkpoints and daily updates. Upload screenshots or images of your work to show what you&apos;ve accomplished.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaUsers className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Community</h3>
                  <p className="mt-1 text-gray-600">Connect with other participants and see what they&apos;re working on. Share ideas and get inspired.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaLightbulb className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Pro Tips</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Update your checkpoints regularly to track your progress</li>
                      <li>Check the community page for inspiration and feedback</li>
                      <li>Reach out to coordinators if you need assistance</li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Overlay>
      
      {/* Header */}
      <Header 
        toggleSidebar={toggleSidebar} 
        setActivePage={handleSetActivePage}
        userData={profile}
        setShowGuideOverlay={setShowGuideOverlay}
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