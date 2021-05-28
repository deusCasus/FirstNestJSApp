import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../../entities';
import { TaskDto } from '../dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  public async checkAccess(taskId: number, userId: number) {
    const task = await this.taskRepository.findOne(taskId, {
      relations: ['taskList', 'taskList.owner']
    });
    if (!task) throw new NotFoundException();
    return task.taskList.owner.id === userId;
  }

  public getListOfTaskByTaskList(taskListId: number): Promise<TaskEntity[]> {
    return this.taskRepository.find({ where: { taskList: taskListId } });
  }

  public createTask(taskListId: number, taskDto: TaskDto): Promise<TaskEntity> {
    return this.taskRepository.save({
      caption: taskDto.caption,
      description: taskDto.description,
      isComplete: false,
      taskList: { id: taskListId },
    });
  }

  public async updateTask(
    taskId: number,
    taskDto: TaskDto,
  ): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne(taskId);
    if (!task) throw new NotFoundException();
    return this.taskRepository.save(taskDto);
  }

  public async removeTask(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({ id: taskId });
    if (!task) throw new NotFoundException();
    await this.taskRepository.remove(task);
  }
}
