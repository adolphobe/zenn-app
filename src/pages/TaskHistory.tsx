import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Task } from '@/types';

// Import refactored components
import { TaskHistoryStats } from '@/components/task-history/TaskHistoryStats';
import { TaskSearchBar, TaskFiltersToggle, AdvancedFilters } from '@/components/task-history/TaskFilters';
import { ViewToggle } from '@/components/task-history/ViewToggle';
import { TaskGroupGrid } from '@/components/task-history/TaskCards';
import { TasksTable } from '@/components/task-history/TaskTable';
import { NoTasksMessage } from '@/components/task-history/NoTasksMessage';
import { groupTasksByTimeline } from '@/components/task-history/utils';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';

const TaskHistory = () => {
  const { state } = useAppContext();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Filter for completed tasks only with completedAt
  const completedTasks = useMemo(() => {
    return state.tasks.filter(task => task.completed && task.completedAt) as Task[];
  }, [state.tasks]);

  // Apply filters and search
  const filteredTasks = useMemo(() => {
    return completedTasks.filter(task => {
      // Search filter
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Period filter
      let matchesPeriod = true;
      
      if (periodFilter !== 'all' && task.completedAt) {
        const now = new Date();
        const completedDate = new Date(task.completedAt);
        
        if (periodFilter === 'today') {
          matchesPeriod = completedDate.toDateString() === now.toDateString();
        } else if (periodFilter === 'week') {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          matchesPeriod = completedDate >= weekStart;
        } else if (periodFilter === 'month') {
          matchesPeriod = completedDate.getMonth() === now.getMonth() && 
                          completedDate.getFullYear() === now.getFullYear();
        }
      }
      
      // Score filter
      let matchesScore = true;
      if (scoreFilter === 'high') {
        matchesScore = task.totalScore >= 12;
      } else if (scoreFilter === 'medium') {
        matchesScore = task.totalScore >= 8 && task.totalScore < 12;
      } else if (scoreFilter === 'low') {
        matchesScore = task.totalScore < 8;
      }
      
      // Feedback filter
      const matchesFeedback = feedbackFilter === 'all' || task.feedback === feedbackFilter;
      
      // Pillar filter
      let matchesPillar = true;
      if (pillarFilter !== 'all') {
        const dominantScore = Math.max(task.consequenceScore, task.prideScore, task.constructionScore);
        if (pillarFilter === 'consequence') {
          matchesPillar = task.consequenceScore === dominantScore;
        } else if (pillarFilter === 'pride') {
          matchesPillar = task.prideScore === dominantScore;
        } else if (pillarFilter === 'construction') {
          matchesPillar = task.constructionScore === dominantScore;
        }
      }
      
      return matchesSearch && matchesPeriod && matchesScore && matchesFeedback && matchesPillar;
    });
  }, [completedTasks, searchQuery, periodFilter, scoreFilter, feedbackFilter, pillarFilter]);

  // Apply sorting
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime();
      } else if (sortBy === 'highScore') {
        return b.totalScore - a.totalScore;
      } else if (sortBy === 'lowScore') {
        return a.totalScore - b.totalScore;
      } else if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filteredTasks, sortBy]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, periodFilter, scoreFilter, feedbackFilter, pillarFilter, sortBy]);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / itemsPerPage));
  
  // Get current page items
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTasks, currentPage, itemsPerPage]);

  // Group by timeline for grid view (using paginated tasks)
  const groupedTasks = useMemo(() => {
    return groupTasksByTimeline(paginatedTasks);
  }, [paginatedTasks]);

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

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col space-y-4">
        {/* Header with stats */}
        <TaskHistoryStats completedTasks={completedTasks} />
        
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <TaskSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          
          <div className="flex gap-2">
            <TaskFiltersToggle 
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
            
            <ViewToggle 
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>
        
        {/* Advanced filters */}
        {showFilters && (
          <AdvancedFilters
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            scoreFilter={scoreFilter}
            setScoreFilter={setScoreFilter}
            feedbackFilter={feedbackFilter}
            setFeedbackFilter={setFeedbackFilter}
            pillarFilter={pillarFilter}
            setPillarFilter={setPillarFilter}
          />
        )}

        {/* No results message */}
        {sortedTasks.length === 0 && <NoTasksMessage />}
        
        {/* Task list view */}
        {viewMode === 'list' && paginatedTasks.length > 0 && <TasksTable tasks={paginatedTasks} />}
        
        {/* Grid view with timeline grouping */}
        {viewMode === 'grid' && paginatedTasks.length > 0 && <TaskGroupGrid groups={groupedTasks} />}
        
        {/* Pagination */}
        {sortedTasks.length > 0 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                {/* Previous button */}
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {/* Page numbers */}
                {getPageNumbers().map((page, index) => (
                  page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page as number)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                {/* Next button */}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
