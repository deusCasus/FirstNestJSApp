import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity, TaskListEntity } from '../../entities';
import { TaskController, TaskListController } from './controller';
import { TaskListService, TaskService } from './service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskListEntity, TaskEntity]),
    AuthModule
  ],
  providers: [TaskListService, TaskService],
  controllers: [TaskListController, TaskController],
})
export class TaskModule {}
