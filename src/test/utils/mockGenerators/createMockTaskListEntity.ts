import { TaskEntity, TaskListEntity, UserEntity } from '../../../entities';
import * as faker from 'faker';
import { createMockUserEntity } from './createMockUserEntity';

export interface CreateMockTaskListEntityArg {
  tasks?: TaskEntity[],
  owner?: UserEntity,
  id?: number,
}

export const createMockTaskListEntity = ({
  id = faker.datatype.number(),
  owner = createMockUserEntity(),
  tasks = []
}: CreateMockTaskListEntityArg): TaskListEntity => ({
  id,
  caption: faker.lorem.words(2),
  owner,
  created_at: faker.date.past(),
  updated_at: faker.date.past(),
  isArchived: false,
  tasks,
});
