import { TaskEntity, TaskListEntity } from '../../../entities';
import * as faker from 'faker';
import { createMockTaskListEntity } from './createMockTaskListEntity';

export const createMockTaskEntity = (taskList?: TaskListEntity, id?: number): TaskEntity => ({
  id: id || faker.datatype.number(),
  caption: faker.lorem.words(2),
  description: faker.lorem.paragraphs(1),
  isComplete: false,
  taskList: taskList || createMockTaskListEntity(),
  created_at: faker.date.past(),
  updated_at: faker.date.past(),
  isArchived: false,
})
