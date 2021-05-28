import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskListEntity } from '../../../entities';
import { TaskListDto } from '../dto';

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskListEntity)
    private taskListRepository: Repository<TaskListEntity>,
  ) {}

  public async checkAccess(taskId: number, userId: number) {
    const taskList = await this.taskListRepository.findOne(taskId, {
      relations: ['owner']
    });

    if (!taskList) throw new NotFoundException();
    return taskList.owner.id === userId;
  }

  public getListOfTaskListByUser(userId: string): Promise<TaskListEntity[]> {
    return this.taskListRepository.find({ where: { owner: userId } });
  }

  public createTaskList(
    userId: number,
    taskListDTO: TaskListDto,
  ): Promise<TaskListEntity> {
    return this.taskListRepository.save({
      ...taskListDTO,
      owner: { id: userId },
    });
  }

  public async updateTaskList(
    taskId: number,
    taskListDTO: TaskListDto,
  ): Promise<TaskListEntity> {
    const taskList = await this.taskListRepository.findOne(taskId);
    if (!taskList) throw new NotFoundException();
    return this.taskListRepository.save(taskListDTO);
  }

  public async removeTaskList(taskId: number): Promise<void> {
    const taskList = await this.taskListRepository.findOne(taskId);
    if (!taskList) throw new NotFoundException();
    await this.taskListRepository.delete(taskList.id);
  }
}
