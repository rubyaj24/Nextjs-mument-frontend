import { useState, useEffect } from 'react';

interface UserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  img_url: string;
  mu_id: string;
  domain: string;
  team: string;
  idea_submission: string;
  is_coordinator?: boolean; // Add the coordinator flag
  is_admin?: boolean; // Add the admin flag
}

export const useUserRole = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/details/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await response.json();
      setUserDetails(userData);
      setIsCoordinator(userData.is_coordinator || false);
      setIsAdmin(userData.is_admin || false);
      setError(null);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return {
    userDetails,
    isCoordinator,
    isAdmin,
    loading,
    error,
    refetch: fetchUserDetails
  };
};