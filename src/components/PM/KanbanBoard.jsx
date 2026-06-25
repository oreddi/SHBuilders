"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import SortableTaskCard from './SortableTaskCard';
import TaskModal from './TaskModal';
import { MoreVertical, Plus, GripVertical } from 'lucide-react';

const STATUS_COLUMNS = [
  { id: 'not_started', title: 'Not Started', color: '#94A3B8' },
  { id: 'todo', title: 'To Do', color: '#3B82F6' },
  { id: 'in_progress', title: 'In Progress', color: '#F59E0B' },
  { id: 'blocked', title: 'Blocked', color: '#EF4444' },
  { id: 'completed', title: 'Completed', color: '#22C55E' },
];

export default function KanbanBoard({ initialTasks, phases, projectId }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [tasks, setTasks] = useState(initialTasks || []);
  const [activeId, setActiveId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState(phases?.[0]?.id || '');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const tasksByStatus = STATUS_COLUMNS.map(col => ({
    ...col,
    tasks: tasks.filter(t => t.status === col.id),
  }));

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Determine the target column
    let targetStatus = over.id;

    // If dropped on a task card, find which column that task is in
    if (!STATUS_COLUMNS.find(c => c.id === targetStatus)) {
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      } else {
        return;
      }
    }

    const task = tasks.find(t => t.id === active.id);
    if (!task || task.status === targetStatus) return;

    // Optimistic update
    setTasks(prev =>
      prev.map(t =>
        t.id === active.id ? { ...t, status: targetStatus } : t
      )
    );

    // Persist to API
    try {
      const res = await fetch(`/api/pm/tasks/${active.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!res.ok) {
        // Revert on failure
        setTasks(prev =>
          prev.map(t =>
            t.id === active.id ? { ...t, status: task.status } : t
          )
        );
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
      // Revert
      setTasks(prev =>
        prev.map(t =>
          t.id === active.id ? { ...t, status: task.status } : t
        )
      );
    }
  }, [tasks]);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    let overStatus = over.id;
    if (!STATUS_COLUMNS.find(c => c.id === overStatus)) {
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask) overStatus = overTask.status;
      else return;
    }

    if (activeTask.status !== overStatus) {
      setTasks(prev =>
        prev.map(t =>
          t.id === active.id ? { ...t, status: overStatus } : t
        )
      );
    }
  }, [tasks]);

  const handleCreateTask = async (taskData) => {
    try {
      const res = await fetch('/api/pm/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          phaseId: taskData.phaseId || selectedPhaseId,
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks(prev => [...prev, newTask]);
        setShowModal(false);
        setEditingTask(null);
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const res = await fetch(`/api/pm/tasks/${taskData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => t.id === updated.id ? { ...updated, status: updated.status } : t));
        setShowModal(false);
        setEditingTask(null);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/pm/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setShowModal(false);
        setEditingTask(null);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {tasksByStatus.map(column => (
            <div key={column.id} className="kanban-column" id={column.id}>
              <div className="column-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: column.color }} />
                  <h4 className="column-title">{column.title}</h4>
                </div>
                <span style={{ fontSize: '12px', opacity: 0.5, fontWeight: 700 }}>
                  {column.tasks.length}
                </span>
              </div>

              <SortableContext
                items={column.tasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
                id={column.id}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minHeight: '60px',
                    padding: '4px',
                  }}
                >
                  {column.tasks.map((task) => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => {
                        setEditingTask(task);
                        setShowModal(true);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>

              <button
                className="kanban-add-btn"
                onClick={() => {
                  setEditingTask(null);
                  setShowModal(true);
                }}
              >
                <Plus size={14} /> Add Task
              </button>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="task-card" style={{ opacity: 0.85, transform: 'rotate(3deg)', boxShadow: '0 15px 40px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h5 className="task-title">{activeTask.title}</h5>
                <GripVertical size={14} style={{ opacity: 0.3 }} />
              </div>
              {activeTask.description && (
                <p style={{ fontSize: '12px', color: 'var(--grey)', lineHeight: 1.4 }}>
                  {activeTask.description}
                </p>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        {showModal && (
          <TaskModal
            task={editingTask}
            phases={phases}
            defaultPhaseId={selectedPhaseId}
            onSave={editingTask ? handleUpdateTask : handleCreateTask}
            onDelete={editingTask ? () => handleDeleteTask(editingTask.id) : null}
            onClose={() => {
              setShowModal(false);
              setEditingTask(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
