import { TaskStatus } from '../../../entities/task.entity';

export type CreateTaskResponse = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
};
