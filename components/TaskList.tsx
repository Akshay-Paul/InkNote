import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onUpdateTaskName: (taskId: string, newName: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ title, tasks, onToggleTask, onUpdateTaskName }) => {
  return (
    <div>
       <h2 className="text-lg font-semibold text-zinc-600 mb-3 px-1">{title}</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/80 overflow-hidden">
        <ul className="divide-y divide-zinc-200">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleTask={onToggleTask}
              onUpdateTaskName={onUpdateTaskName}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};