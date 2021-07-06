import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskListEntity } from '../../../entities';
import { CreateTaskListDTO, EditTaskListDTO, TaskListDTO } from '../dto';

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskListEntity)
    private taskListRepository: Repository<TaskListEntity>,
  ) {}

  public async checkAccess(taskId: number, userId: number): Promise<boolean> {
    const taskList = await this.taskListRepository.findOne(taskId, {
      relations: ['owner'],
    });

    if (!taskList) throw new NotFoundException();
    return taskList.owner.id === userId;
  }

  public async getListOfTaskListByUser(userId: number): Promise<TaskListDTO[]> {
    const listOfTaskList = await this.taskListRepository.find({
      where: { owner: userId },
      order: { created_at: 'ASC' },
    });

    return listOfTaskList.map((item) => ({
      id: item.id,
      caption: item.caption,
    }));
  }

  public async createTaskList(
    userId: number,
    taskListDTO: CreateTaskListDTO,
  ): Promise<TaskListDTO> {
    const createdTaskList = await this.taskListRepository.save({
      ...taskListDTO,
      owner: { id: userId },
    });

    return {
      id: createdTaskList.id,
      caption: createdTaskList.caption,
    };
  }

  public async updateTaskList(
    taskId: number,
    taskListDTO: EditTaskListDTO,
  ): Promise<TaskListDTO> {
    const taskList = await this.taskListRepository.findOne(taskId);
    if (!taskList) throw new NotFoundException();
    taskList.caption = taskListDTO.caption;
    const updatedTaskList = await this.taskListRepository.save(taskList);

    return {
      id: updatedTaskList.id,
      caption: updatedTaskList.caption,
    };
  }

  public async removeTaskList(taskId: number): Promise<void> {
    const taskList = await this.taskListRepository.findOne(taskId);
    if (!taskList) throw new NotFoundException();
    await this.taskListRepository.delete(taskList.id);
  }
}
