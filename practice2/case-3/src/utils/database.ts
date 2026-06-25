import axios from 'axios';
import { User, Post, Comment } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Subscription {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface AccessRequest {
  id: string;
  postId: string;
  requesterId: string;
  authorId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ApiComment extends Omit<Comment, 'createdAt'> {
  createdAt: string;
}

export interface ApiPost extends Omit<Post, 'createdAt' | 'updatedAt' | 'comments'> {
  createdAt: string;
  updatedAt: string;
}

export interface ApiUser extends Omit<User, 'createdAt' | 'followings' | 'followers'> {
  createdAt: string;
}

export class DatabaseService {
  static async getUsers(): Promise<User[]> {
    try {
      const response = await api.get<ApiUser[]>('/users');
      const users = response.data.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        followings: [] as string[],
        followers: [] as string[]
      }));

      const subscriptions = await this.getSubscriptions();
      users.forEach(user => {
        user.followings = subscriptions
          .filter(sub => sub.followerId === user.id)
          .map(sub => sub.followingId);
        user.followers = subscriptions
          .filter(sub => sub.followingId === user.id)
          .map(sub => sub.followerId);
      });

      return users;
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      throw error;
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'followings' | 'followers'>): Promise<User> {
    try {
      const newUser: ApiUser = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...userData,
        createdAt: new Date().toISOString()
      };

      const response = await api.post<ApiUser>('/users', newUser);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        followings: [],
        followers: []
      };
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      throw error;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Ошибка при поиске пользователя по email:', error);
      return null;
    }
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const { followings, followers, createdAt, ...updateData } = userData;
      await api.patch<ApiUser>(`/users/${userId}`, updateData);
      const users = await this.getUsers();
      return users.find(user => user.id === userId)!;
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      throw error;
    }
  }

  static async getSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await api.get<Subscription[]>('/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке подписок:', error);
      return [];
    }
  }

  static async createSubscription(followerId: string, followingId: string): Promise<Subscription> {
    try {
      const subscription: Subscription = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        followerId,
        followingId,
        createdAt: new Date().toISOString()
      };

      const response = await api.post<Subscription>('/subscriptions', subscription);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании подписки:', error);
      throw error;
    }
  }

  static async deleteSubscription(followerId: string, followingId: string): Promise<void> {
    try {
      const subscriptions = await this.getSubscriptions();
      const subscription = subscriptions.find(
        sub => sub.followerId === followerId && sub.followingId === followingId
      );

      if (subscription) {
        await api.delete(`/subscriptions/${subscription.id}`);
      }
    } catch (error) {
      console.error('Ошибка при удалении подписки:', error);
      throw error;
    }
  }

  static async getPosts(): Promise<Post[]> {
    try {
      const [postsResponse, commentsResponse] = await Promise.all([
        api.get<ApiPost[]>('/posts'),
        api.get<ApiComment[]>('/comments')
      ]);

      const posts = postsResponse.data.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        comments: commentsResponse.data
          .filter(comment => comment.postId === post.id)
          .map(comment => ({
            ...comment,
            createdAt: new Date(comment.createdAt)
          }))
      }));

      return posts;
    } catch (error) {
      console.error('Ошибка при загрузке постов:', error);
      throw error;
    }
  }

  static async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Post> {
    try {
      const newPost: ApiPost = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await api.post<ApiPost>('/posts', newPost);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        comments: []
      };
    } catch (error) {
      console.error('Ошибка при создании поста:', error);
      throw error;
    }
  }

  static async updatePost(postId: string, postData: Partial<Post>): Promise<Post> {
    try {
      const { comments, createdAt, updatedAt, ...updateData } = postData;
      const apiData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      await api.patch<ApiPost>(`/posts/${postId}`, apiData);
      const posts = await this.getPosts();
      return posts.find(post => post.id === postId)!;
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error);
      throw error;
    }
  }

  static async deletePost(postId: string): Promise<void> {
    try {
      await this.deleteCommentsByPostId(postId);
      await api.delete(`/posts/${postId}`);
    } catch (error) {
      console.error('Ошибка при удалении поста:', error);
      throw error;
    }
  }

  static async createComment(commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    try {
      const newComment: ApiComment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...commentData,
        createdAt: new Date().toISOString()
      };

      const response = await api.post<ApiComment>('/comments', newComment);
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt)
      };
    } catch (error) {
      console.error('Ошибка при создании комментария:', error);
      throw error;
    }
  }

  static async deleteCommentsByPostId(postId: string): Promise<void> {
    try {
      const comments = await api.get<ApiComment[]>('/comments');
      const postComments = comments.data.filter(comment => comment.postId === postId);
      
      await Promise.all(
        postComments.map(comment => api.delete(`/comments/${comment.id}`))
      );
    } catch (error) {
      console.error('Ошибка при удалении комментариев:', error);
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      await api.get('/users');
      return true;
    } catch (error) {
      console.error('Нет соединения с сервером базы данных:', error);
      return false;
    }
  }

  static async getAccessRequests(): Promise<AccessRequest[]> {
    try {
      const response = await api.get<AccessRequest[]>('/accessRequests');
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке запросов доступа:', error);
      return [];
    }
  }

  static async createAccessRequest(postId: string, requesterId: string, authorId: string): Promise<AccessRequest> {
    try {
      const newRequest: AccessRequest = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        postId,
        requesterId,
        authorId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await api.post<AccessRequest>('/accessRequests', newRequest);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании запроса доступа:', error);
      throw error;
    }
  }

  static async updateAccessRequestStatus(requestId: string, status: 'approved' | 'rejected'): Promise<AccessRequest> {
    try {
      const response = await api.patch<AccessRequest>(`/accessRequests/${requestId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении статуса запроса:', error);
      throw error;
    }
  }

  static async getAccessRequestForPost(postId: string, requesterId: string): Promise<AccessRequest | null> {
    try {
      const requests = await this.getAccessRequests();
      return requests.find(req => req.postId === postId && req.requesterId === requesterId) || null;
    } catch (error) {
      console.error('Ошибка при поиске запроса доступа:', error);
      return null;
    }
  }

  static async getUserAccessRequests(userId: string): Promise<AccessRequest[]> {
    try {
      const requests = await this.getAccessRequests();
      return requests.filter(req => req.authorId === userId);
    } catch (error) {
      console.error('Ошибка при загрузке запросов пользователя:', error);
      return [];
    }
  }
}
