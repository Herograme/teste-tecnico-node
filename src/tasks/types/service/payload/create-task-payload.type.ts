import { TaskStatus } from '../../../entities/task.entity';

export type CreateTaskPayload = {
  title: string;
  description: string;
  userId: string;
  status?: TaskStatus;
};
