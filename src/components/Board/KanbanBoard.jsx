import React, { useCallback, useMemo, useRef, useState } from 'react';
import Column from './Column';

export default function KanbanBoard({ columns, jobs, onMoveJob, onEditJob, isFiltered = false, filteredEmptyState }) {
  const [draggedJobId, setDraggedJobId] = useState(null);
  const [draggedOverColumnId, setDraggedOverColumnId] = useState(null);
  const draggedOverColumnRef = useRef(null);

  const jobsByColumn = useMemo(() => {
    const grouped = Object.fromEntries(columns.map((column) => [column.id, []]));

    jobs.forEach((job) => {
      if (!grouped[job.status]) grouped[job.status] = [];
      grouped[job.status].push(job);
    });

    return grouped;
  }, [columns, jobs]);

  const clearDragState = useCallback(() => {
    setDraggedJobId(null);
    draggedOverColumnRef.current = null;
    setDraggedOverColumnId(null);
  }, []);

  const handleCardDragStart = useCallback((jobId) => {
    setDraggedJobId(jobId);
  }, []);

  const handleDragOverColumn = useCallback((columnId) => {
    if (draggedOverColumnRef.current !== columnId) {
      draggedOverColumnRef.current = columnId;
      setDraggedOverColumnId(columnId);
    }
  }, []);

  const handleDragLeaveColumn = useCallback((columnId) => {
    if (draggedOverColumnRef.current === columnId) {
      draggedOverColumnRef.current = null;
      setDraggedOverColumnId(null);
    }
  }, []);

  const handleDropColumn = useCallback((jobId, columnId) => {
    onMoveJob(jobId, columnId);
    clearDragState();
  }, [clearDragState, onMoveJob]);

  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3 lg:grid-cols-5">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          jobs={jobsByColumn[column.id] || []}
          draggedJobId={draggedJobId}
          isDragOver={draggedOverColumnId === column.id}
          onMoveJob={handleDropColumn}
          onEditJob={onEditJob}
          onCardDragStart={handleCardDragStart}
          onCardDragEnd={clearDragState}
          onDragOverColumn={handleDragOverColumn}
          onDragLeaveColumn={handleDragLeaveColumn}
          isFiltered={isFiltered}
          filteredEmptyState={filteredEmptyState}
        />
      ))}
    </div>
  );
}
