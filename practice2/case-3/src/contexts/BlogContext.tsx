import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, BlogContextType, User, AccessRequest } from '../types';
import { useAuth } from './AuthContext';
import { DatabaseService } from '../utils/database';

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog должен использоваться внутри BlogProvider');
  }
  return context;
};

interface BlogProviderProps {
  children: React.ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [dbPosts, dbUsers, dbAccessRequests] = await Promise.all([
        DatabaseService.getPosts(),
        DatabaseService.getUsers(),
        DatabaseService.getAccessRequests()
      ]);
      setPosts(dbPosts);
      setUsers(dbUsers);
      setAccessRequests(dbAccessRequests.map(req => ({
        ...req,
        createdAt: new Date(req.createdAt)
      })));
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (title: string, content: string, tags: string[], isPrivate: boolean, isRequestOnly: boolean) => {
    if (!currentUser) return;

    try {
      const newPost = await DatabaseService.createPost({
        authorId: currentUser.id,
        title,
        content,
        tags,
        isPrivate,
        isRequestOnly
      });

      setPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Ошибка при создании поста:', error);
    }
  };

  const updatePost = async (postId: string, title: string, content: string, tags: string[], isPrivate: boolean, isRequestOnly: boolean) => {
    if (!currentUser) return;

    try {
      const updatedPost = await DatabaseService.updatePost(postId, {
        title,
        content,
        tags,
        isPrivate,
        isRequestOnly
      });

      setPosts(prev => prev.map(post => 
        post.id === postId ? updatedPost : post
      ));
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!currentUser) return;

    try {
      await DatabaseService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Ошибка при удалении поста:', error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!currentUser) return;

    try {
      const newComment = await DatabaseService.createComment({
        postId,
        authorId: currentUser.id,
        content
      });

      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    }
  };

  const getPostsByUser = (userId: string): Post[] => {
    return posts.filter(post => post.authorId === userId);
  };

  const getPublicPosts = (): Post[] => {
    return posts.filter(post => !post.isPrivate && !post.isRequestOnly);
  };

  const getSubscriptionPosts = (): Post[] => {
    if (!currentUser) return [];

    return posts.filter(post => {
      if (post.isRequestOnly) {
        const approvedRequest = accessRequests.find(req => 
          req.postId === post.id && 
          req.requesterId === currentUser.id && 
          req.status === 'approved'
        );
        return currentUser.followings.includes(post.authorId) && (post.authorId === currentUser.id || approvedRequest);
      }
      return currentUser.followings.includes(post.authorId);
    });
  };

  const getRequestOnlyPosts = (): Post[] => {
    if (!currentUser) return [];

    return posts.filter(post => post.isRequestOnly);
  };

  const hasAccessToPost = (postId: string): boolean => {
    if (!currentUser) return false;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return false;
    
    if (post.authorId === currentUser.id) return true;
    
    if (!post.isRequestOnly) return true;
    
    const approvedRequest = accessRequests.find(req => 
      req.postId === postId && 
      req.requesterId === currentUser.id && 
      req.status === 'approved'
    );
    
    return !!approvedRequest;
  };

  const getPostsByTag = (tag: string): Post[] => {
    return posts.filter(post => 
      post.tags.includes(tag) && (!post.isPrivate || post.authorId === currentUser?.id)
    );
  };

  const getAllTags = (): string[] => {
    const allTags = posts.flatMap(post => post.tags);
    return Array.from(new Set(allTags));
  };

  const requestAccess = async (postId: string) => {
    if (!currentUser) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const existingRequest = await DatabaseService.getAccessRequestForPost(postId, currentUser.id);
      if (existingRequest) {
        alert('Запрос уже отправлен');
        return;
      }

      await DatabaseService.createAccessRequest(postId, currentUser.id, post.authorId);
      await refreshData();
      alert('Запрос на доступ отправлен автору поста');
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      alert('Ошибка при отправке запроса');
    }
  };

  const approveAccessRequest = async (requestId: string) => {
    try {
      await DatabaseService.updateAccessRequestStatus(requestId, 'approved');
      await refreshData();
    } catch (error) {
      console.error('Ошибка при одобрении запроса:', error);
    }
  };

  const rejectAccessRequest = async (requestId: string) => {
    try {
      await DatabaseService.updateAccessRequestStatus(requestId, 'rejected');
      await refreshData();
    } catch (error) {
      console.error('Ошибка при отклонении запроса:', error);
    }
  };

  const getUserAccessRequests = (): AccessRequest[] => {
    if (!currentUser) return [];
    return accessRequests.filter(req => req.authorId === currentUser.id);
  };

  const value: BlogContextType = {
    posts,
    users,
    comments: [], 
    subscriptions: [],
    accessRequests,
    isLoading,
    createPost,
    updatePost,
    deletePost,
    addComment,
    getPostsByUser,
    getPublicPosts,
    getSubscriptionPosts,
    getRequestOnlyPosts,
    hasAccessToPost,
    getPostsByTag,
    getAllTags,
    requestAccess,
    approveAccessRequest,
    rejectAccessRequest,
    getUserAccessRequests,
    refreshData
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};
