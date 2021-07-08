import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCommentEntity, TaskEntity, TaskListEntity } from '../../entities';
import { TaskCommentController, TaskController, TaskListController } from './controllers';
import { TaskCommentService, TaskListService, TaskService } from './services';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskListEntity, TaskEntity, TaskCommentEntity]),
    AuthModule
  ],
  providers: [TaskListService, TaskService, TaskCommentService],
  controllers: [TaskListController, TaskController, TaskCommentController],
})
export class TaskModule {}
