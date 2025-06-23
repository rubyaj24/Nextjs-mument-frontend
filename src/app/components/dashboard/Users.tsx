import {useEffect, useState} from 'react'
import { FaPhone, FaWhatsapp } from 'react-icons/fa';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    // Add other user properties as needed
}

const Users = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/all/`)
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading users...</div>
        </div>;
    }

    const handlePhoneClick = (e: React.MouseEvent, phone: string) => {
        e.stopPropagation();
        // Open phone dialer
        window.location.href = `tel:${phone}`;
    };

    const handleWhatsAppClick = (e: React.MouseEvent, phone: string) => {
        e.stopPropagation();
        // Clean phone number (remove all non-digits) and add country code if needed
        const cleanPhone = phone.replace(/\D/g, '');
        // You might need to add country code, for example for India: +91
        const whatsappUrl = `https://wa.me/${cleanPhone}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
        <div>
            <h2 className="text-2xl font-bold mb-4">All Users - Admin View</h2>
            <p className="text-gray-600 mb-6">Here is the list of all registered users.</p>
        </div>
        <div>
          <input 
          type='search' 
          placeholder='Search users by name or email...' 
          className='border border-gray-300 rounded p-2 mb-4 w-full md:w-1/3 focus:outline-none focus:border-blue-500'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
            <p className="text-gray-600 mb-4">
                {searchTerm ? `Found ${filteredUsers.length} of ${users.length} users` : `Total Users: ${users.length}`}
            </p>
        </div>
        {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
                <p className="text-gray-500">
                    {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="p-4 rounded bg-white shadow hover:shadow-lg transition-shadow duration-200">
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex justify-between items-center">
                    <p>{user.phone}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handlePhoneClick(e, user.phone)}
                        className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                        title="Call"
                      >
                          <FaPhone className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => handleWhatsAppClick(e, user.phone)}
                        className="text-green-500 hover:text-green-700 transition-colors p-1"
                        title="WhatsApp"
                      >
                          <FaWhatsapp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        )}
        </>
    )
}

export default Users