'use client'
import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa'
import { IoMenu } from "react-icons/io5";
import { useState, useEffect } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
  setActivePage: (page: string) => void;
}

const Header = ({ toggleSidebar, setActivePage }: HeaderProps) => {
  const [userName, setUserName] = useState('User');
  const [profile, setProfile] = useState<{ img_url?: string }>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/details/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUserName(userData.name || 'User');
            setProfile({
              img_url: userData.img_url || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        // Fallback to stored email or default
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          setUserName(userEmail.split('@')[0]); // Use email prefix as fallback
        }
      }
    };

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    

    checkMobile();

    fetchUserName();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/signin';
  };

  const handleProfileClick = () => {
      setActivePage('profile');
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
              <span className='italic text-2xl'>Hi, </span><span className='font-semibold text-3xl'>{userName}!</span>
            </h1>
          </div>
          <div className="flex justify-around space-x-4">
            <div className="relative">
              <div 
                className="h-8 w-8 rounded-full bg-white flex items-center justify-center cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
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
        </div>
    </>
  )
}

export default Header