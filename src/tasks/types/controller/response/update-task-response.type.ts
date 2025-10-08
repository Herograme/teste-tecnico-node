import { TaskStatus } from '../../../entities/task.entity';

export type UpdateTaskResponse = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  userName: string;
  createdAt: Date;
};
