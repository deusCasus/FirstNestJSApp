import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskListEntity, UserEntity } from '../../../entities';
import {
  createMockTaskListEntity,
  createMockUserEntity,
} from '../../../test/utils/mockGenerators';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskListDTO, EditTaskListDTO, TaskListDTO } from '../dto';
import { UserData } from '../../../infra/decorators';
import { TaskListService } from '../services';
import { TaskListController } from './taskList.controller';
import { Repository } from 'typeorm';

describe('TaskList service', () => {
  let taskListService: TaskListService;
  let taskListController: TaskListController;
  let userEntity: UserEntity;
  let userData: UserData;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TaskListController],
      providers: [
        TaskListService,
        {
          provide: getRepositoryToken(TaskListEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    taskListService = moduleRef.get<TaskListService>(TaskListService);
    taskListController = moduleRef.get<TaskListController>(TaskListController);

    userEntity = createMockUserEntity();
    userData = { userId: userEntity.id, username: userEntity.username };
  });

  it('should be defined', () => {
    expect(taskListController).toBeDefined();
  });

  it('should success execute getListOfTaskListByUser', async () => {
    const taskList: TaskListDTO[] = new Array(10)
      .fill(null)
      .map((_, i) => createMockTaskListEntity({
        owner: userEntity,
        id: i
      }))
      .map((item) => ({ id: item.id, caption: item.caption }));

    jest
      .spyOn(taskListService, 'getListOfTaskListByUser')
      .mockResolvedValueOnce(taskList);

    expect(await taskListController.getListOfTaskList(userData)).toEqual(
      taskList,
    );
  });

  it('should success execute createTaskList', async () => {
    const taskListEntity: TaskListEntity = createMockTaskListEntity(userEntity);
    const taskListDTO: TaskListDTO = {
      id: taskListEntity.id,
      caption: taskListEntity.caption,
    };
    const createTaskListDTO: CreateTaskListDTO = {
      caption: taskListDTO.caption,
    };

    jest
      .spyOn(taskListService, 'createTaskList')
      .mockResolvedValueOnce(taskListDTO);

    expect(
      await taskListController.createTaskList(userData, createTaskListDTO),
    ).toEqual(taskListDTO);
  });

  it('should success execute updateTaskList', async () => {
    const taskListEntity: TaskListEntity = createMockTaskListEntity(userEntity);
    const taskListDTO: TaskListDTO = {
      id: taskListEntity.id,
      caption: taskListEntity.caption,
    };
    const editTaskListDTO: EditTaskListDTO = { caption: taskListDTO.caption };

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(true);
    jest
      .spyOn(taskListService, 'updateTaskList')
      .mockResolvedValueOnce(taskListDTO);

    expect(
      await taskListController.updateTaskList(
        userData,
        taskListDTO.id,
        editTaskListDTO,
      ),
    ).toEqual(taskListDTO);
  });

  it('should throw error in updateTaskList if find task with another owner', async () => {
    const taskListEntity: TaskListEntity = createMockTaskListEntity(userEntity);
    const taskListDTO: TaskListDTO = {
      id: taskListEntity.id,
      caption: taskListEntity.caption,
    };
    const editTaskListDTO: EditTaskListDTO = { caption: taskListDTO.caption };

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(false);
    jest
      .spyOn(taskListService, 'updateTaskList')
      .mockResolvedValueOnce(taskListDTO);

    await expect(
      taskListController.updateTaskList(
        userData,
        taskListDTO.id,
        editTaskListDTO,
      ),
    ).rejects.toThrowError(new NotFoundException());
  });

  it('should success execute removeTaskList', async () => {
    const taskListEntity: TaskListEntity = createMockTaskListEntity(userEntity);

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(true);
    jest
      .spyOn(taskListService, 'removeTaskList')
      .mockResolvedValueOnce(undefined);

    expect(
      await taskListController.removeTaskList(userData, taskListEntity.id),
    ).toEqual(undefined);
  });

  it('should throw error in removeTaskList if find task with another owner', async () => {
    const taskListEntity: TaskListEntity = createMockTaskListEntity(userEntity);

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(false);
    jest
      .spyOn(taskListService, 'removeTaskList')
      .mockResolvedValueOnce(undefined);

    await expect(
      taskListController.removeTaskList(userData, taskListEntity.id),
    ).rejects.toThrowError(new NotFoundException());
  });
});
