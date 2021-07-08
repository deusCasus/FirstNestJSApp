import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskCommentDTO, EditTaskCommentDTO, TaskCommentDTO } from '../dto';
import { TaskCommentEntity } from '../../../entities';
import { convertTaskCommentEntityToDto } from '../utils/convertTaskCommentEntityToDto';

@Injectable()
export class TaskCommentService {
  constructor(
    @InjectRepository(TaskCommentEntity)
    private taskCommentRepository: Repository<TaskCommentEntity>,
  ) {}

  public async checkAccess(commentId: number, userId: number): Promise<boolean> {
    const comment = await this.taskCommentRepository.findOne(commentId, {
      relations: ['creator', 'task', 'task.taskList', 'task.taskList.owner'],
    });

    if (!comment) throw new NotFoundException();
    if (comment.creator.id === userId) return true;
    return comment.task.taskList.owner.id === userId;
  }

  public async getListByTask(taskId: number): Promise<TaskCommentDTO[]> {
    const listOfComment = await this.taskCommentRepository.find({
      where: { task: taskId },
      order: { created_at: 'ASC' },
    });

    return listOfComment.map(
      (item) => convertTaskCommentEntityToDto(item)
    );
  }

  public async createComment(
    taskId: number,
    creatorId: number,
    createTaskCommentDTO: CreateTaskCommentDTO
  ): Promise<TaskCommentDTO> {
    const taskCommentEntity = await this.taskCommentRepository.save({
      ...createTaskCommentDTO,
      creator: { id: creatorId },
      task: { id: taskId },
    });

    return convertTaskCommentEntityToDto(taskCommentEntity);
  }

  public async updateComment(
    commentId: number,
    editTaskCommentDTO: EditTaskCommentDTO
  ): Promise<TaskCommentDTO> {
    const taskComment = await this.taskCommentRepository.findOne(commentId);

    if (!taskComment) throw new NotFoundException();
    taskComment.content = editTaskCommentDTO.content;

    const updatedTaskComment = await this.taskCommentRepository.save(taskComment);
    return convertTaskCommentEntityToDto(updatedTaskComment);
  }

  public async removeComment(commentId: number): Promise<void> {
    const taskComment = await this.taskCommentRepository.findOne(commentId);
    if (!taskComment) throw new NotFoundException();
    await this.taskCommentRepository.delete(taskComment.id);
  }

}
