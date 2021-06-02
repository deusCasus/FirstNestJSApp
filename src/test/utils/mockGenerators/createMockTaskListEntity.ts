import { TaskListEntity, UserEntity } from '../../../entities';
import * as faker from 'faker';
import { createMockUserEntity } from './createMockUserEntity';

export const createMockTaskListEntity = (user?: UserEntity, id?: number): TaskListEntity => ({
  id: id || faker.datatype.number(),
  caption: faker.lorem.words(2),
  owner: user || createMockUserEntity(),
  created_at: faker.date.past(),
  updated_at: faker.date.past(),
  isArchived: false,
  tasks: []
})
