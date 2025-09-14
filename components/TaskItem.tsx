import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';
import { CategoryPill } from './CategoryPill';
import { Check } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleTask: (taskId: string) => void;
  onUpdateTaskName: (taskId: string, newName: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleTask, onUpdateTaskName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    // Prevent editing of completed tasks
    if (task.completed) return;
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // Only save if text is not empty and has changed
    if (editText.trim() && editText.trim() !== task.name) {
      onUpdateTaskName(task.id, editText.trim());
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      // Revert changes and exit edit mode
      setEditText(task.name);
      setIsEditing(false);
    }
  };
  
  return (
    <li
      className="flex items-center p-4 transition-colors duration-150 group"
    >
      <div 
        onClick={() => onToggleTask(task.id)}
        className="relative mr-4 flex-shrink-0 cursor-pointer"
        aria-label={`Mark ${task.name} as ${task.completed ? 'incomplete' : 'complete'}`}
      >
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-blue-500 border-blue-500'
              : 'bg-transparent border-zinc-300 group-hover:border-zinc-400'
          }`}
        >
          {task.completed && <Check size={16} className="text-white" />}
        </div>
      </div>
      <div className="flex-grow" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
           <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-2 py-0.5 -my-0.5 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label={`Edit task name for ${task.name}`}
          />
        ) : (
          <p className={`text-zinc-800 transition-colors duration-200 ${task.completed ? 'line-through text-zinc-400' : 'cursor-text'}`}>
            {task.name}
          </p>
        )}
      </div>
      <CategoryPill category={task.category} />
    </li>
  );
};
