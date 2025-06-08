import Image from 'next/image';
import { FaUser } from 'react-icons/fa'
import { IoMenu } from "react-icons/io5";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
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
              className="w-32 px-2 pt-2"
            />
            <h1 className="text-white text-3xl">Hi, User!</h1>
          </div>
          <div className="flex justify-around space-x-4">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <FaUser className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </div>
    </>
  )
}

export default Header