import { BaseEntity } from './base.entity';
import { TaskList } from './taskList.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'task' })
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  caption: string;

  @Column({ type: 'text' })
  descripton: string;

  @Column({ type: 'boolean', default: false })
  isComplite: boolean;

  @ManyToOne(() => TaskList, taskList => taskList.tasks)
  taskList: TaskList;
}
