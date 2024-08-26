// components/UserProfile.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/authService';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.email}</h1>
          {/* Display other user details as needed */}
        </div>
      ) : (
        <div>No user is logged in</div>
      )}
    </div>
  );
};

export default UserProfile;
