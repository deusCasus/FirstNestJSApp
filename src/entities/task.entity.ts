import { BaseEntity } from './base.entity';
import { TaskListEntity } from './taskList.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TaskCommentEntity } from './taskComment.entity';

@Entity({ name: 'task' })
export class TaskEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  caption: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isComplete: boolean;

  @ManyToOne(
    () => TaskListEntity,
    (taskList) => taskList.tasks,
    { onDelete: 'CASCADE' }
  )
  taskList: TaskListEntity;

  @OneToMany(
    () => TaskCommentEntity,
    (taskComment) => taskComment.task,
    { onDelete: 'CASCADE', }
  )
  comments: TaskCommentEntity[];
}
