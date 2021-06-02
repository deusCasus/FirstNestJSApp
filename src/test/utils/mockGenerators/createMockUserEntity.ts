import { UserEntity } from '../../../entities';
import * as faker from 'faker';

export const createMockUserEntity = (id?: number): UserEntity => {
  const date = faker.date.past();
  return {
    id: id || faker.datatype.number(),
    username: faker.name.title(),
    email: faker.internet.email(),
    password: faker.datatype.string(32),
    taskLists: [],
    created_at: date,
    updated_at: date,
    isArchived: false
  }
}
