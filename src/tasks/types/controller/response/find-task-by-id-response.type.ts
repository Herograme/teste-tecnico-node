import { TaskStatus } from '../../../entities/task.entity';

export type FindTaskByIdResponse = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  userName: string;
  createdAt: Date;
};
