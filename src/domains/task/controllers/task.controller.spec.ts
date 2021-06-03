import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity, TaskListEntity, UserEntity } from '../../../entities';
import {
  createMockTaskEntity,
  createMockTaskListEntity,
  createMockUserEntity
} from '../../../test/utils/mockGenerators';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDTO, EditTaskDTO, TaskDTO, TaskListDTO } from '../dto';
import { UserData } from '../../../infra/decorators';
import { TaskListService, TaskService } from '../services';
import { Repository } from 'typeorm';
import { TaskController } from './task.controller';

describe('Task service', () => {
  let taskListService: TaskListService;
  let taskService: TaskService;
  let taskController: TaskController;
  let userEntity: UserEntity;
  let userData: UserData;

  let parentTaskListEntity: TaskListEntity;
  let parentTaskListDTO: TaskListDTO;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskListService,
        TaskService,
        {
          provide: getRepositoryToken(TaskListEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TaskEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    taskController = moduleRef.get<TaskController>(TaskController);
    taskListService = moduleRef.get<TaskListService>(TaskListService);
    taskService = moduleRef.get<TaskService>(TaskService);

    userEntity = createMockUserEntity();
    userData = { userId: userEntity.id, username: userEntity.username };

    parentTaskListEntity = createMockTaskListEntity(userEntity);
    parentTaskListDTO = {
      id: parentTaskListEntity.id,
      caption: parentTaskListEntity.caption
    }
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  it('should success execute getListOfTaskListByUser', async () => {
    const taskList: TaskDTO[] = new Array(10).fill(null)
      .map((_, i) => createMockTaskEntity(parentTaskListEntity, i))
      .map(item => ({
        id: item.id,
        caption: item.caption,
        description: item.description,
        isComplete: item.isComplete
      }));

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(true);
    jest.spyOn(taskService, 'getListOfTaskByTaskList').mockResolvedValueOnce(taskList);

    expect(await taskController.getListOfTaskList(userData, parentTaskListDTO.id))
      .toEqual(taskList)
  });

  it('should success execute createTask', async () => {
    const taskEntity: TaskEntity = createMockTaskEntity(parentTaskListEntity);
    const taskDTO: TaskDTO = {
      id: taskEntity.id,
      caption: taskEntity.caption,
      description: taskEntity.description,
      isComplete: taskEntity.isComplete
    };

    const createTaskDTO: CreateTaskDTO = {
      caption: taskEntity.caption,
      description: taskEntity.description,
    };

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(true);
    jest.spyOn(taskService, 'createTask').mockResolvedValueOnce(taskDTO);

    expect(await taskController.createTask(userData, parentTaskListDTO.id, createTaskDTO))
      .toEqual(taskDTO)
  });

  it('should throw error in createTask if find parent taskList with another owner', async () => {
    const taskEntity: TaskEntity = createMockTaskEntity(parentTaskListEntity);
    const taskDTO: TaskDTO = {
      id: taskEntity.id,
      caption: taskEntity.caption,
      description: taskEntity.description,
      isComplete: taskEntity.isComplete
    };

    const createTaskDTO: CreateTaskDTO = {
      caption: taskEntity.caption,
      description: taskEntity.description,
    };

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(false);
    jest.spyOn(taskService, 'createTask').mockResolvedValueOnce(taskDTO);

    await expect(taskController.createTask(userData, parentTaskListDTO.id, createTaskDTO))
      .rejects
      .toThrowError(new NotFoundException())
  });

  it('should success execute updateTask', async () => {
    const taskEntity: TaskEntity = createMockTaskEntity(parentTaskListEntity);
    const taskDTO: TaskDTO = {
      id: taskEntity.id,
      caption: taskEntity.caption,
      description: taskEntity.description,
      isComplete: taskEntity.isComplete
    };

    const editTaskDTO: EditTaskDTO = {
      caption: taskEntity.caption,
      description: taskEntity.description,
      isComplete: taskEntity.isComplete
    };

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(true);
    jest.spyOn(taskService, 'checkAccess').mockResolvedValueOnce(true);
    jest.spyOn(taskService, 'updateTask').mockResolvedValueOnce(taskDTO);

    expect(await taskController.updateTask(
      userData,
      parentTaskListDTO.id,
      taskEntity.id,
      editTaskDTO
    )).toEqual(taskDTO)
  });

  it('should throw error in updateTask if find parent taskList with another owner', async () => {
    const taskEntity: TaskEntity = createMockTaskEntity(parentTaskListEntity);
    const taskDTO: TaskDTO = {
      id: taskEntity.id,
      caption: taskEntity.caption,
      description: taskEntity.description,
      isComplete: taskEntity.isComplete
    };

    const editTaskDTO: EditTaskDTO = {
      caption: taskEntity.caption,
      description: taskEntity.description,
      isComplete: taskEntity.isComplete
    };

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(false);
    jest.spyOn(taskService, 'checkAccess').mockResolvedValueOnce(true);
    jest.spyOn(taskService, 'updateTask').mockResolvedValueOnce(taskDTO);

    await expect(taskController.updateTask(
      userData,
      parentTaskListDTO.id,
      taskEntity.id,
      editTaskDTO
    )).rejects.toThrowError(new NotFoundException())
  });

  it('should success execute removeTask', async () => {
    const taskEntity: TaskEntity = createMockTaskEntity(parentTaskListEntity);

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(true);
    jest.spyOn(taskService, 'checkAccess').mockResolvedValueOnce(true);
    jest.spyOn(taskService, 'removeTask').mockResolvedValueOnce(undefined);

    expect(await taskController.removeTask(
      userData,
      parentTaskListDTO.id,
      taskEntity.id,
    )).toEqual(undefined)
  });

  it('should throw error in removeTask if find parent taskList with another owner', async () => {
    const taskEntity: TaskEntity = createMockTaskEntity(parentTaskListEntity);

    jest.spyOn(taskListService, 'checkAccess').mockResolvedValueOnce(false);
    jest.spyOn(taskService, 'checkAccess').mockResolvedValueOnce(true);
    jest.spyOn(taskService, 'removeTask').mockResolvedValueOnce(undefined);

    await expect(taskController.removeTask(
      userData,
      parentTaskListDTO.id,
      taskEntity.id,
    )).rejects.toThrowError(new NotFoundException())
  });
});
