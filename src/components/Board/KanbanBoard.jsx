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

  const handleTouchDragMove = useCallback((columnId) => {
    if (!columnId) return;
    handleDragOverColumn(columnId);
  }, [handleDragOverColumn]);

  const handleTouchDrop = useCallback((jobId) => {
    const targetColumnId = draggedOverColumnRef.current;
    if (targetColumnId) {
      onMoveJob(jobId, targetColumnId);
    }
    clearDragState();
  }, [clearDragState, onMoveJob]);

  return (
    <div className="modal-scrollbar -mx-4 flex touch-pan-x snap-x snap-mandatory items-start gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
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
          onTouchDragMove={handleTouchDragMove}
          onTouchDrop={handleTouchDrop}
          onDragOverColumn={handleDragOverColumn}
          onDragLeaveColumn={handleDragLeaveColumn}
          isFiltered={isFiltered}
          filteredEmptyState={filteredEmptyState}
        />
      ))}
    </div>
  );
}
