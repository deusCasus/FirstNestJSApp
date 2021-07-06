import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../../entities';
import { CreateTaskDTO, EditTaskDTO, TaskDTO } from '../dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  public async checkAccess(taskId: number, userId: number) {
    const task = await this.taskRepository.findOne(taskId, {
      relations: ['taskList', 'taskList.owner'],
    });
    if (!task) throw new NotFoundException();
    return task.taskList.owner.id === userId;
  }

  public async getListOfTaskByTaskList(taskListId: number): Promise<TaskDTO[]> {
    const listOfTask = await this.taskRepository.find({
      where: { taskList: taskListId },
      order: { created_at: 'ASC' },
    });

    return listOfTask.map((item) => ({
      id: item.id,
      caption: item.caption,
      description: item.description,
      isComplete: item.isComplete,
    }));
  }

  public async createTask(
    taskListId: number,
    taskDto: CreateTaskDTO,
  ): Promise<TaskDTO> {
    const createdTask = await this.taskRepository.save({
      caption: taskDto.caption,
      description: taskDto.description,
      isComplete: false,
      taskList: { id: taskListId },
    });

    return {
      id: createdTask.id,
      caption: createdTask.caption,
      description: createdTask.description,
      isComplete: createdTask.isComplete,
    };
  }

  public async updateTask(
    taskId: number,
    taskDto: EditTaskDTO,
  ): Promise<TaskDTO> {
    const task = await this.taskRepository.findOne(taskId);
    if (!task) throw new NotFoundException();
    task.caption = taskDto.caption;
    task.description = taskDto.description;
    task.isComplete = taskDto.isComplete;

    const updatedTask = await this.taskRepository.save(task);

    return {
      id: updatedTask.id,
      caption: updatedTask.caption,
      description: updatedTask.description,
      isComplete: updatedTask.isComplete,
    };
  }

  public async removeTask(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({ id: taskId });
    if (!task) throw new NotFoundException();
    await this.taskRepository.remove(task);
  }
}
