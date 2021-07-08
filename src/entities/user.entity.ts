import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskListEntity } from './taskList.entity';
import { TaskCommentEntity } from './taskComment.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => TaskListEntity, (taskList) => taskList.owner, {
    onDelete: 'CASCADE',
  })
  taskLists: TaskListEntity[];

  @OneToMany(
    () => TaskCommentEntity ,
    (taskComment) => taskComment.creator,
    { onDelete: 'CASCADE' }
  )
  taskComments: TaskCommentEntity[];
}
