import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  useEffect(() => {
    document.body.classList.toggle('of-card-dragging', Boolean(draggedJobId));
    return () => document.body.classList.remove('of-card-dragging');
  }, [draggedJobId]);

  return (
    <div className="modal-scrollbar -mx-4 flex [touch-action:pan-x_pan-y] snap-x snap-mandatory items-start gap-4 overflow-x-auto px-4 pb-3 [-webkit-overflow-scrolling:touch] sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
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
