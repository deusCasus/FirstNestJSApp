import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as faker from 'faker';
import { TaskListService } from './taskList.service';
import { TaskListEntity, UserEntity } from '../../../entities';
import { Repository } from 'typeorm';
import { CreateTaskListDTO, EditTaskListDTO, TaskListDTO } from '../dto';
import { createMockTaskListEntity, createMockUserEntity } from '../../../test/utils/mockGenerators';
import { NotFoundException } from '@nestjs/common';

describe('task list service', () => {
  let service: TaskListService;
  let repo: Repository<TaskListEntity>;
  let userEntity: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskListService,
        {
          provide: getRepositoryToken(TaskListEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TaskListService>(TaskListService);
    repo = module.get<Repository<TaskListEntity>>(getRepositoryToken(TaskListEntity));
    userEntity = createMockUserEntity();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should should success execute checkAccess with correct user', async () => {
    const taskList = createMockTaskListEntity(userEntity);

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(taskList);
    expect(await service.checkAccess(taskList.id, userEntity.id))
      .toEqual(true);
  });

  it('should success execute checkAccess with incorrect user', async () => {
    const taskList = createMockTaskListEntity(userEntity);
    const authorUser = createMockUserEntity(userEntity.id + 1);

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(taskList);
    expect(await service.checkAccess(taskList.id, authorUser.id))
      .toEqual(false);
  });

  it('should throw error in checkAccess if not find task list by id', async () => {
    const taskList = createMockTaskListEntity(userEntity);

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined);
    await expect(service.checkAccess(taskList.id + 1, userEntity.id))
      .rejects
      .toThrowError(new NotFoundException());
  });

  it('should success execute getListOfTaskListByUser', async () => {
    const listOfTaskList = new Array(10).fill(null)
      .map((_, i) => createMockTaskListEntity(userEntity, i));

    const listOfTaskListDTO = listOfTaskList.map<TaskListDTO>(item => ({
      id: item.id,
      caption: item.caption
    }));


    jest.spyOn(repo, 'find').mockResolvedValueOnce(listOfTaskList);
    expect(await service.getListOfTaskListByUser(userEntity.id))
      .toEqual(listOfTaskListDTO);
  });

  it('should success execute createTaskList', async () => {
    const taskList = createMockTaskListEntity(userEntity);
    const taskListDTO: TaskListDTO = { id: taskList.id, caption: taskList.caption };
    const createTaskListDTO: CreateTaskListDTO = {
      caption: taskList.caption
    };


    jest.spyOn(repo, 'save').mockResolvedValueOnce(taskList);
    expect(await service.createTaskList(userEntity.id, createTaskListDTO))
      .toEqual(taskListDTO);
  });

  it('should success execute updateTaskList', async () => {
    const taskList = createMockTaskListEntity(userEntity);
    const editTaskListDTO: EditTaskListDTO = {
      caption: faker.lorem.words(2)
    };

    const updatedTaskList: TaskListEntity = {
      ...taskList,
      caption: editTaskListDTO.caption
    }

    const resTaskListDTO: TaskListDTO = {
      id: updatedTaskList.id,
      caption: updatedTaskList.caption
    };

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(taskList);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(updatedTaskList);

    expect(await service.updateTaskList(taskList.id, editTaskListDTO))
      .toEqual(resTaskListDTO);
  });

  it('should throw error in updateTaskList if not find task list by id', async () => {
    const taskList = createMockTaskListEntity(userEntity);
    const editTaskListDTO: EditTaskListDTO = {
      caption: faker.lorem.words(2)
    };

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined);

    await expect(service.updateTaskList(taskList.id, editTaskListDTO))
      .rejects
      .toThrow(NotFoundException)
  })

  it('should success execute removeTaskList', async () => {
    const taskList = createMockTaskListEntity(userEntity);

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(taskList);
    jest.spyOn(repo, 'delete').mockResolvedValueOnce(undefined);

    expect(await service.removeTaskList(taskList.id))
      .toEqual(undefined)
  })

  it('should throw error in removeTaskList if not find task list by id', async () => {
    const taskList = createMockTaskListEntity(userEntity);

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(undefined);

    await expect(service.removeTaskList(taskList.id))
      .rejects
      .toThrowError(new NotFoundException())
  })
});
