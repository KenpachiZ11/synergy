export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  followings: string[];
  followers: string[];
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  isRequestOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
}

export interface BlogContextType {
  posts: Post[];
  users: User[];
  comments: Comment[];
  subscriptions: any[];
  accessRequests: AccessRequest[];
  isLoading: boolean;
  createPost: (title: string, content: string, tags: string[], isPrivate: boolean, isRequestOnly: boolean) => Promise<void>;
  updatePost: (postId: string, title: string, content: string, tags: string[], isPrivate: boolean, isRequestOnly: boolean) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  getPostsByUser: (userId: string) => Post[];
  getPublicPosts: () => Post[];
  getSubscriptionPosts: () => Post[];
  getRequestOnlyPosts: () => Post[];
  hasAccessToPost: (postId: string) => boolean;
  getPostsByTag: (tag: string) => Post[];
  getAllTags: () => string[];
  requestAccess: (postId: string) => void;
  approveAccessRequest: (requestId: string) => Promise<void>;
  rejectAccessRequest: (requestId: string) => Promise<void>;
  getUserAccessRequests: () => AccessRequest[];
  refreshData: () => Promise<void>;
}

export type SortBy = 'date' | 'title' | 'tags';
export type SortOrder = 'asc' | 'desc';

export interface AccessRequest {
  id: string;
  postId: string;
  requesterId: string;
  authorId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}
