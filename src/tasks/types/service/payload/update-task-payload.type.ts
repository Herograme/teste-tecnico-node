import { TaskStatus } from '../../../entities/task.entity';

export type UpdateTaskPayload = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};
