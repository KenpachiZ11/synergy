import { useState, useMemo } from 'react';
import { Post, SortBy, SortOrder } from '../types';

export const useSortedPosts = (posts: Post[]) => {
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'tags':
          const aTagsStr = a.tags.join(', ');
          const bTagsStr = b.tags.join(', ');
          comparison = aTagsStr.localeCompare(bTagsStr);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [posts, sortBy, sortOrder]);

  const handleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return {
    sortedPosts,
    sortBy,
    sortOrder,
    handleSort
  };
};
