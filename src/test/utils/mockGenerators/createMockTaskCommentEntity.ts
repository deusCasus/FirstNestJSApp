import { TaskCommentEntity, TaskEntity, UserEntity } from '../../../entities';
import * as faker from 'faker';
import { createMockUserEntity } from './createMockUserEntity';
import { createMockTaskEntity } from './createMockTaskEntity';

export interface CreateMockTaskCommentEntityArg {
    task?: TaskEntity;
    user?: UserEntity;
    id?: number;
}

export const createMockTaskCommentEntity = ({
    task = createMockTaskEntity({}),
    user = createMockUserEntity(),
    id = faker.datatype.number(),
}: CreateMockTaskCommentEntityArg): TaskCommentEntity => ({
    id,
    content: faker.lorem.words(2),
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
    task: task,
    taskId: task.id,
    creator: user,
    creatorId: user.id,
    isArchived: false
});
