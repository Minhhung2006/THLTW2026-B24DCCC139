import { useEffect, useState } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'doing' | 'done';
  tags: string[];
}

const STORAGE_KEY = 'TH09_TASKS';

export default function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (task: Task) => {
    setTasks(prev =>
      prev.map(t => (t.id === task.id ? task : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateStatus = (id: string, status: Task['status']) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status } : t
      )
    );
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(
      t =>
        new Date(t.deadline) < new Date() &&
        t.status !== 'done'
    ).length,
  };

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    updateStatus,
    stats,
  };
}