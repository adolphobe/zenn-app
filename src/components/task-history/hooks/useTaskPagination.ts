
import { useState, useMemo, useEffect } from 'react';
import { Task } from '@/types';
import { groupTasksByTimeline } from '../utils';

export const useTaskPagination = (
  sortedTasks: Task[], 
  periodFilter: string = 'all',
  itemsPerPage: number = 30
) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when tasks change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortedTasks]);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / itemsPerPage));
  
  // Get current page items
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTasks, currentPage, itemsPerPage]);

  // Group by timeline for grid view, passing the period filter
  const groupedTasks = useMemo(() => {
    return groupTasksByTimeline(paginatedTasks, periodFilter);
  }, [paginatedTasks, periodFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of the page for better UX
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // If few pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    
    // Always include first page
    pageNumbers.push(1);
    
    // Add ellipsis if current page is far from the beginning
    if (currentPage > 3) {
      pageNumbers.push('ellipsis-start');
    }
    
    // Pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis if current page is far from the end
    if (currentPage < totalPages - 2) {
      pageNumbers.push('ellipsis-end');
    }
    
    // Always include last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return {
    currentPage,
    totalPages,
    paginatedTasks,
    groupedTasks,
    handlePageChange,
    getPageNumbers
  };
};
