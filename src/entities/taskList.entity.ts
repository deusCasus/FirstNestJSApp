import { BaseEntity } from './base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity({ name: 'task-list' })
export class TaskList extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  caption: string;

  @ManyToOne(() => User, (user) => user.taskLists)
  owner: string;

  @OneToMany(() => Task, (task) => task.taskList)
  tasks: Task[];
}
