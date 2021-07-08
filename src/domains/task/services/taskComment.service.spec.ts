import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as faker from 'faker';
import { TaskCommentEntity, UserEntity } from '../../../entities';
import { Repository } from 'typeorm';
import { CreateTaskCommentDTO, EditTaskCommentDTO } from '../dto';
import {
  createMockTaskEntity,
  createMockTaskListEntity,
  createMockUserEntity
} from '../../../test/utils/mockGenerators';
import { NotFoundException } from '@nestjs/common';
import { TaskCommentService } from './taskComment.service';
import { createMockTaskCommentEntity } from '../../../test/utils/mockGenerators/createMockTaskCommentEntity';
import { convertTaskCommentEntityToDto } from '../utils/convertTaskCommentEntityToDto';

describe('task comment service', () => {
  let service: TaskCommentService;
  let repo: Repository<TaskCommentEntity>;
  let userEntity: UserEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskCommentService,
        {
          provide: getRepositoryToken(TaskCommentEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TaskCommentService>(TaskCommentService);
    repo = module.get<Repository<TaskCommentEntity>>(
      getRepositoryToken(TaskCommentEntity),
    );
    userEntity = createMockUserEntity();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute checkAccess by taskList owner', async () => {
    const taskList = createMockTaskListEntity({ owner: userEntity });
    const task = createMockTaskEntity({ taskList });
    const taskComment = createMockTaskCommentEntity({ task })

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(taskComment);
    expect(await service.checkAccess(taskComment.id, userEntity.id)).toEqual(true);
  });

  it('should execute checkAccess by comment creator', async () => {
    const taskList = createMockTaskListEntity({});
    const task = createMockTaskEntity({ taskList });
    const taskComment = createMockTaskCommentEntity({ task, user: userEntity })

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(taskComment);
    expect(await service.checkAccess(taskComment.id, userEntity.id)).toEqual(true);
  });

  it('should execute checkAccess with incorrect user', async () => {
    const taskList = createMockTaskListEntity({});
    const task = createMockTaskEntity({ taskList });
    const taskComment = createMockTaskCommentEntity({ task })

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(taskComment);
    expect(await service.checkAccess(taskComment.id, userEntity.id)).toEqual(false);
  });

  it('should throw error in checkAccess if not find task list by id', async () => {
    const taskComment = createMockTaskCommentEntity({})

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined);
    await expect(
      service.checkAccess(taskComment.id + 1, userEntity.id),
    ).rejects.toThrowError(new NotFoundException());
  });

  it('should success execute getListByTask', async () => {
    const task = createMockTaskEntity({});
    const listOfTaskList = new Array(10)
      .fill(null)
      .map((_, i) => createMockTaskCommentEntity({ task, id: i }));

    const listOfTaskCommentDTO = listOfTaskList.map(
      (item) => convertTaskCommentEntityToDto(item)
    );

    jest.spyOn(repo, 'find').mockResolvedValueOnce(listOfTaskList);
    expect(await service.getListByTask(task.id)).toEqual(
      listOfTaskCommentDTO,
    );
  });

  it('should success execute createComment', async () => {
    const task = createMockTaskEntity({});
    const taskComment = createMockTaskCommentEntity({
      user: userEntity,
      task
    });

    const createTaskCommentDto: CreateTaskCommentDTO = {
      content: taskComment.content
    }

    const taskCommentDTO = convertTaskCommentEntityToDto(taskComment);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(taskComment);

    expect(
      await service.createComment(task.id, userEntity.id, createTaskCommentDto),
    ).toEqual(taskCommentDTO);
  });

  it('should success execute updateComment', async () => {
    const taskComment = createMockTaskCommentEntity({});

    const editTaskCommentDTO: EditTaskCommentDTO = {
      content: faker.lorem.words(5)
    }

    const updateTaskComment: TaskCommentEntity = {
      ...taskComment,
      content: editTaskCommentDTO.content
    }
    const updateTaskCommentDTO = convertTaskCommentEntityToDto(updateTaskComment);

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(taskComment);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(updateTaskComment);

    expect(await service.updateComment(taskComment.id, editTaskCommentDTO)).toEqual(
      updateTaskCommentDTO,
    );
  });

  it('should throw error in updateComment if not find task by id', async () => {
    const taskComment = createMockTaskCommentEntity({});
    const editTaskCommentDTO: EditTaskCommentDTO = {
      content: faker.lorem.words(5)
    };

    const updateTaskComment: TaskCommentEntity = {
      ...taskComment,
      content: editTaskCommentDTO.content
    }

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(updateTaskComment);

    await expect(
      service.updateComment(taskComment.id, editTaskCommentDTO),
    ).rejects.toThrow(NotFoundException);
  });

  it('should success execute removeComment', async () => {
    const taskComment = createMockTaskCommentEntity({});

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(taskComment);
    jest.spyOn(repo, 'delete').mockResolvedValueOnce(undefined);

    expect(await service.removeComment(taskComment.id)).toEqual(undefined);
  });

  it('should throw error in removeComment if not find task list by id', async () => {
    const taskComment = createMockTaskCommentEntity({});

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined);
    jest.spyOn(repo, 'delete').mockResolvedValueOnce(undefined);

    await expect(service.removeComment(taskComment.id)).rejects.toThrowError(
      new NotFoundException(),
    );
  });
});
