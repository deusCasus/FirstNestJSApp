import { BaseEntity } from './base.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskEntity } from './task.entity';

@Entity({ name: 'task-comment' })
export class TaskCommentEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(
    () => TaskEntity,
    (task) => task.comments,
    { onDelete: 'CASCADE' }
  )
  task: TaskEntity;


  @RelationId((taskComment: TaskCommentEntity) => taskComment.task)
  taskId: number;

  @ManyToOne(
    () => UserEntity,
    (task) => task.taskComments,
    { onDelete: 'CASCADE' }
  )
  creator: UserEntity;

  @RelationId((taskComment: TaskCommentEntity) => taskComment.creator)
  creatorId: number;
}
