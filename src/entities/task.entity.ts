import { BaseEntity } from './base.entity';
import { TaskListEntity } from './taskList.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'task' })
export class TaskEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  caption: string;

  @Column({ type: 'text' })
  descripton: string;

  @Column({ type: 'boolean', default: false })
  isComplite: boolean;

  @ManyToOne(() => TaskListEntity, taskList => taskList.tasks)
  taskList: TaskListEntity;
}
