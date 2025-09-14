
import React from 'react';
import { TaskCategory } from '../types';

interface CategoryPillProps {
  category: TaskCategory;
}

const categoryColors: Record<TaskCategory, string> = {
  [TaskCategory.WORK]: 'bg-indigo-100 text-indigo-700',
  [TaskCategory.PERSONAL]: 'bg-green-100 text-green-700',
  [TaskCategory.SHOPPING]: 'bg-yellow-100 text-yellow-700',
  [TaskCategory.HEALTH]: 'bg-red-100 text-red-700',
  [TaskCategory.FINANCE]: 'bg-cyan-100 text-cyan-700',
  [TaskCategory.OTHER]: 'bg-zinc-200 text-zinc-700',
};

export const CategoryPill: React.FC<CategoryPillProps> = ({ category }) => {
  const colorClasses = categoryColors[category] || categoryColors[TaskCategory.OTHER];

  return (
    <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClasses}`}>
      {category}
    </div>
  );
};
