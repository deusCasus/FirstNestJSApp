import { TaskCommentEntity, TaskEntity, TaskListEntity } from '../../../entities';
import * as faker from 'faker';
import { createMockTaskListEntity } from './createMockTaskListEntity';

export interface CreateMockTaskEntityArg {
  taskList?: TaskListEntity,
  comments?: TaskCommentEntity[],
  id?: number,
}

export const createMockTaskEntity = ({
  id = faker.datatype.number(),
  taskList = createMockTaskListEntity({}),
  comments = [],
}: CreateMockTaskEntityArg): TaskEntity => ({
    id,
    caption: faker.lorem.words(2),
    description: faker.lorem.paragraphs(1),
    isComplete: false,
    taskList,
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
    comments,
    isArchived: false,
});
