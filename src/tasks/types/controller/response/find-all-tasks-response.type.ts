import { TaskStatus } from '../../../entities/task.entity';

export type FindAllTasksResponse = Array<{
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  userName: string;
  createdAt: Date;
}>;
