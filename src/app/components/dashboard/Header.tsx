'use client'
import Image from 'next/image';
import Link from 'next/link';
import { FaBlackTie, FaCrown, FaUser } from 'react-icons/fa'
import { IoMenu } from "react-icons/io5";
import { useState, useEffect } from 'react';
import { useUserRole } from '@/app/hooks/useUserRole';
import { IoIosClose } from 'react-icons/io';

interface HeaderProps {
  toggleSidebar: () => void;
  setActivePage: (page: string) => void;
  userData?: {
    name?: string;
    img_url?: string;
    email?: string;
  };
  setShowGuideOverlay: (show: boolean) => void;
}

const Header = ({ toggleSidebar, setActivePage, userData, setShowGuideOverlay }: HeaderProps) => {
  const [userName, setUserName] = useState('User');
  const [profile, setProfile] = useState<{ img_url?: string }>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isCoordinator, isAdmin } = useUserRole();
  const [showCoordinatorMessage, setShowCoordinatorMessage] = useState(false);
  const [showAdminMessage, setShowAdminMessage] = useState(false);

  useEffect(() => {
    if (userData) {
      setUserName(userData.name || 'User');
      setProfile({ img_url: userData.img_url });
    } else {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        setUserName(userEmail.split('@')[0] || 'User');
      }
    }

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    if(showCoordinatorMessage) {
      const timer = setTimeout(() => {
        setShowCoordinatorMessage(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }

    if(showAdminMessage) {
      const timer = setTimeout(() => {
        setShowAdminMessage(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }

    checkMobile();
  }, [userData, showCoordinatorMessage, showAdminMessage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/signin';
  };

  const handleProfileClick = () => {
      setActivePage('profile');
      setShowDropdown(false);
    };

  const handleCoordinatorClick = () => {
    setShowCoordinatorMessage(true);
    setShowAdminMessage(false);
    setShowDropdown(false);
  };

  const handleAdminClick = () => {
    setShowAdminMessage(true);
    setShowDropdown(false);
    setShowCoordinatorMessage(false);
  };

  const handleGuideClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowGuideOverlay(true);
    setShowDropdown(false);
  };

  return (
    <>
        <div className="flex bg-blue-600 justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <IoMenu className="h-6 w-6 md:hidden text-white"
              onClick={toggleSidebar} />
            <Image
              src="/Vector.svg"
              alt="Logo"
              width={100}
              height={100}
              className={isMobile ? "hidden" : "w-32 px-2 pt-2"}
            />
            <h1 className="text-white">
              <span className='italic text-xl'>Hi, </span><span className='font-semibold text-2xl md:text-3xl lg:text-3xl'>{userName.split(' ')[0].charAt(0).toUpperCase() + userName.split(' ')[0].slice(1).toLowerCase()}!</span>
            </h1>
          </div>
          <div className="flex justify-around space-x-4">
            {isCoordinator ? isAdmin ? (
              <FaCrown className="h-6 w-6 text-white self-center cursor-pointer hover:text-gray-200 transition-colors"
                onClick={handleAdminClick} />
            ) : (
              <FaBlackTie className="h-6 w-6 text-white self-center cursor-pointer hover:text-gray-200 transition-colors"
                onClick={handleCoordinatorClick} />
            ) : null}
            {/* {isAdmin && (
              <FaCrown className="h-6 w-6 text-white self-center cursor-pointer hover:text-gray-200 transition-colors" 
              onClick={handleAdminClick}/>
            )} */}
            <div className="relative">
              <div 
                className="h-8 w-8 rounded-full bg-white flex items-center justify-center cursor-pointer"
                onClick={() => { setShowDropdown(!showDropdown); setShowCoordinatorMessage(false); setShowAdminMessage(false); }}
              >
                {profile.img_url ? <Image src={profile.img_url} alt="Profile" width={32} height={32} className="rounded-full" /> : <FaUser className="h-5 w-5 text-gray-700" />}
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                    onClick={handleProfileClick}>Profile</Link>
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-500">Go to Home</Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                    onClick={handleGuideClick}
                  >
                    User Guide
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Log out
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Coordinator Message Box */}
          {showCoordinatorMessage && (
            <div className="absolute top-16 right-6 w-64 bg-white rounded-lg shadow-lg p-4 z-20 border-l-4 border-blue-600">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <FaBlackTie className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Coordinator Status</h3>
                  <p className="mt-1 text-sm text-gray-500">You&apos;re a coordinator now</p>
                </div>
                <button 
                  className="ml-auto bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowCoordinatorMessage(false)}
                >
                  <span className="sr-only">Close</span>
                  <IoIosClose className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Admin Message Box */}
          {showAdminMessage && (
            <div className="absolute top-16 right-6 w-64 bg-white rounded-lg shadow-lg p-4 z-20 border-l-4 border-yellow-600">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <FaCrown className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Admin Status</h3>
                  <p className="mt-1 text-sm text-gray-500">You&apos;re an admin now</p>
                </div>
                <button 
                  className="ml-auto bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowAdminMessage(false)}
                >
                  <span className="sr-only">Close</span>
                  <IoIosClose className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
    </>
  )
}

export default Header