'use client'
import { FaUser } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa6'
import { MdOutlineLogout } from "react-icons/md";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SideBarProps {
  isOpen: boolean;
  isMobile?: boolean;
  setActivePage: (page: string) => void;
  activePage: string;
  toggleSidebar: () => void;
}

const SideBar = ({ isOpen, setActivePage, activePage, toggleSidebar }: SideBarProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-open sidebar on large screens
      if (!mobile && !isOpen) {
        // You might need to call toggleSidebar here if the parent allows it
        // For now, we'll handle this in the parent component
      }
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [isOpen]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('refreshToken');
    
    // Redirect to signin
    router.push('/signin');
  };

  const handlePageChange = (page: string) => {
    console.log('Sidebar - changing to page:', page);
    setActivePage(page);
    
    // Close sidebar on mobile after selection
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Handle overlay click on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-gray-700/50 z-40"
          onClick={handleOverlayClick}
        />
      )}
      
      <aside className={`
        ${isMobile 
          ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            } w-64`
          : `${isOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 ease-in-out`
        } 
        bg-white shadow-sm min-h-screen
      `}>
          <nav className="mt-8">
            <div className="px-6 py-4">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Menu
              </h2>
            </div>
            
            <div className="space-y-1">
              <button
                onClick={() => handlePageChange('profile')}
                className={`flex items-center w-full px-6 py-3 text-left transition-colors whitespace-nowrap ${
                  activePage === 'profile' 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FaUser className="h-5 w-5 mr-3" />
                Profile
              </button>
              
              <button
                onClick={() => handlePageChange('community')}
                className={`flex items-center w-full px-6 py-3 text-left transition-colors whitespace-nowrap ${
                  activePage === 'community' 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FaUsers className="h-5 w-5 mr-3" />
                Community
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors whitespace-nowrap"
              >
                <MdOutlineLogout className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </aside>
        </>
  )
}

export default SideBar