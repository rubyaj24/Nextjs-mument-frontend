'use client'
import { FaUser } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa6'
import { MdOutlineLogout } from "react-icons/md";

interface SideBarProps {
  isOpen: boolean;
  setActivePage: (page: string) => void;
  activePage: string;
}

const SideBar = ({ isOpen, setActivePage, activePage }: SideBarProps) => {

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
  };

  const handlePageChange = (page: string) => {
    console.log('Sidebar - changing to page:', page);
    setActivePage(page);
  };

  return (
    <>
    <aside className={`${isOpen ? 'w-64' : 'w-0 overflow-hidden'} bg-white shadow-sm min-h-screen transition-all duration-300 ease-in-out`}>
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