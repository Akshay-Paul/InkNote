
export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  FINANCE = 'Finance',
  OTHER = 'Other',
}

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  completed: boolean;
}
