import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { DatabaseService } from '../utils/database';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const isConnected = await DatabaseService.checkConnection();
        if (isConnected) {
          const dbUsers = await DatabaseService.getUsers();
          setUsers(dbUsers);
          
          const savedUserId = localStorage.getItem('current_user_id');
          if (savedUserId) {
            const user = dbUsers.find(u => u.id === savedUserId);
            if (user) {
              setCurrentUser(user);
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('current_user_id');
    }
  }, [currentUser]);

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const existingUser = await DatabaseService.getUserByEmail(email);
      if (existingUser) {
        return false;
      }

      const newUser = await DatabaseService.createUser({
        username,
        email,
        password
      });

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      return true;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка при входе:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const followUser = async (userId: string) => {
    if (!currentUser || currentUser.id === userId) return;

    try {
      await DatabaseService.createSubscription(currentUser.id, userId);
      
      const updatedUsers = await DatabaseService.getUsers();
      setUsers(updatedUsers);
      
      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser);
      }
    } catch (error) {
      console.error('Ошибка при подписке:', error);
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!currentUser) return;

    try {
      await DatabaseService.deleteSubscription(currentUser.id, userId);
      
      const updatedUsers = await DatabaseService.getUsers();
      setUsers(updatedUsers);
      
      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser);
      }
    } catch (error) {
      console.error('Ошибка при отписке:', error);
    }
  };

  const value: AuthContextType = {
    currentUser,
    users,
    isLoading,
    login,
    register,
    logout,
    followUser,
    unfollowUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
