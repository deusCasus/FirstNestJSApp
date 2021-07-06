import { BaseEntity } from './base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskEntity } from './task.entity';

@Entity({ name: 'task-list' })
export class TaskListEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  caption: string;

  @ManyToOne(() => UserEntity, (user) => user.taskLists, {
    onDelete: 'CASCADE',
  })
  owner: UserEntity;

  @OneToMany(() => TaskEntity, (task) => task.taskList, { onDelete: 'CASCADE' })
  tasks: TaskEntity[];
}
