import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskEntity, UserEntity } from '../../../entities';
import { Repository } from 'typeorm';
import {
  createMockTaskEntity,
  createMockTaskListEntity,
  createMockUserEntity,
} from '../../../test/utils/mockGenerators';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDTO, EditTaskDTO, TaskDTO } from '../dto';

describe('task service', () => {
  let service: TaskService;
  let taskRepo: Repository<TaskEntity>;
  let userEntity: UserEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get<Repository<TaskEntity>>(
      getRepositoryToken(TaskEntity),
    );
    userEntity = createMockUserEntity();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should success execute checkAccess with correct task', async () => {
    const taskList = createMockTaskListEntity({ owner: userEntity });
    const task = createMockTaskEntity({ taskList });

    jest.spyOn(taskRepo, 'findOne').mockResolvedValueOnce(task);

    expect(await service.checkAccess(task.id, userEntity.id)).toEqual(true);
  });

  it('should success execute checkAccess with incorrect task', async () => {
    const taskList = createMockTaskListEntity(userEntity);
    const task = createMockTaskEntity(taskList);

    jest.spyOn(taskRepo, 'findOne').mockResolvedValueOnce(task);

    expect(await service.checkAccess(task.id, userEntity.id + 1)).toEqual(
      false,
    );
  });

  it('should throw error in checkAccess if not find task by id', async () => {
    const taskList = createMockTaskListEntity(userEntity);
    const task = createMockTaskEntity(taskList);

    jest.spyOn(taskRepo, 'findOne').mockResolvedValueOnce(undefined);

    await expect(
      service.checkAccess(task.id + 1, userEntity.id),
    ).rejects.toThrowError(new NotFoundException());
  });

  it('should success execute getListOfTaskByTaskList', async () => {
    const taskList = createMockTaskListEntity({});
    const listOfTask = new Array(10)
      .fill(null)
      .map(() => createMockTaskEntity(taskList));

    const listOfTaskDTO = listOfTask.map<TaskDTO>((task) => ({
      id: task.id,
      caption: task.caption,
      description: task.description,
      isComplete: task.isComplete,
    }));

    jest.spyOn(taskRepo, 'find').mockResolvedValueOnce(listOfTask);

    expect(await service.getListOfTaskByTaskList(taskList.id)).toEqual(
      listOfTaskDTO,
    );
  });

  it('should success execute createTask', async () => {
    const task = createMockTaskEntity({});

    const createTaskDTO: CreateTaskDTO = {
      caption: task.caption,
      description: task.description,
    };

    const taskDTO: TaskDTO = {
      id: task.id,
      caption: task.caption,
      description: task.description,
      isComplete: task.isComplete,
    };

    jest.spyOn(taskRepo, 'save').mockResolvedValueOnce(task);

    expect(await service.createTask(task.taskList.id, createTaskDTO)).toEqual(
      taskDTO,
    );
  });

  it('should success execute updateTask', async () => {
    const task = createMockTaskEntity({});

    const editTaskDTO: EditTaskDTO = {
      caption: task.caption,
      description: task.description,
      isComplete: false,
    };

    const updateTaskEntity: TaskEntity = {
      ...task,
      ...editTaskDTO,
    };

    const taskDTO: TaskDTO = {
      id: task.id,
      caption: editTaskDTO.caption,
      description: editTaskDTO.description,
      isComplete: editTaskDTO.isComplete,
    };

    jest.spyOn(taskRepo, 'findOne').mockResolvedValueOnce(task);
    jest.spyOn(taskRepo, 'save').mockResolvedValueOnce(updateTaskEntity);

    expect(await service.updateTask(task.taskList.id, editTaskDTO)).toEqual(
      taskDTO,
    );
  });

  it('should throw error in updateTask if not fount task by id', async () => {
    const task = createMockTaskEntity({});
    const editTaskDTO: EditTaskDTO = {
      caption: task.caption,
      description: task.description,
      isComplete: false,
    };

    jest.spyOn(taskRepo, 'findOne').mockResolvedValueOnce(undefined);

    await expect(
      service.updateTask(task.taskList.id + 1, editTaskDTO),
    ).rejects.toThrowError(new NotFoundException());
  });

  it('should success execute removeTask', async () => {
    const task = createMockTaskEntity({});

    jest.spyOn(taskRepo, 'findOne').mockResolvedValueOnce(task);
    jest.spyOn(taskRepo, 'remove').mockResolvedValueOnce(undefined);

    expect(await service.removeTask(task.taskList.id)).toEqual(undefined);
  });

  it('should throw error in removeTask if not fount task by id', async () => {
    const task = createMockTaskEntity({});

    jest.spyOn(taskRepo, 'findOne').mockResolvedValueOnce(undefined);
    jest.spyOn(taskRepo, 'remove').mockResolvedValueOnce(undefined);

    await expect(service.removeTask(task.taskList.id + 1)).rejects.toThrowError(
      new NotFoundException(),
    );
  });
});
