import {useEffect, useState} from 'react'

interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
}

const Users = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);


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
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

  return (
    <>
    <div>
        <h2 className="text-2xl font-bold mb-4">All Users - Admin View</h2>
        <p className="text-gray-600 mb-6">Here is the list of all registered users.</p>
    </div>
    <div>
        <p className="text-gray-600 mb-4">Total Users: {users.length}</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <div key={user.id} className="p-4 rounded bg-white shadow hover:shadow-lg transition-shadow duration-200">
          <h3 className="font-bold">{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
    </>
  )
}

export default Users