import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard';
import { User } from '../../../infra/decorator';
import { TaskListService, TaskService } from '../service';
import { TaskEntity } from '../../../entities';
import { TaskDto } from '../dto';

@Controller()
export class TaskController {
  constructor(
    private taskListService: TaskListService,
    private taskService: TaskService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/task/:taskListId/list')
  public async getListOfTaskList(
    @User() user: any,
    @Param('taskListId') taskListId: number,
  ): Promise<TaskEntity[]> {
    const canAccess = await this.taskListService.checkAccess(
      taskListId,
      user.userId,
    );
    if (!canAccess) throw new NotFoundException();
    return this.taskService.getListOfTaskByTaskList(taskListId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/task/:taskListId/list')
  public async createTask(
    @User() user: any,
    @Param('taskListId') taskListId: number,
    @Body() taskDto: TaskDto,
  ): Promise<TaskEntity> {
    const canAccess = await this.taskListService.checkAccess(
      taskListId,
      user.userId,
    );
    if (!canAccess) throw new NotFoundException();
    return this.taskService.createTask(taskListId, taskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/task/:taskListId/list/:taskId')
  public async updateTask(
    @User() user: any,
    @Param('taskListId') taskListId: number,
    @Param('taskId') taskId: number,
    @Body() taskDto: TaskDto,
  ): Promise<TaskEntity> {
    const canAccessToTaskList = await this.taskListService.checkAccess(
      taskListId,
      user.userId,
    );
    if (!canAccessToTaskList) throw new NotFoundException();
    const canAccessToTask = await this.taskService.checkAccess(
      taskId,
      user.userId,
    );
    if (!canAccessToTask) throw new NotFoundException();
    return this.taskService.updateTask(taskId, taskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/task/:taskListId/list/:taskId')
  public async removeTask(
    @User() user: any,
    @Param('taskListId') taskListId: number,
    @Param('taskId') taskId: number,
  ): Promise<void> {
    const canAccessToTaskList = await this.taskListService.checkAccess(
      taskListId,
      user.userId,
    );
    if (!canAccessToTaskList) throw new NotFoundException();
    const canAccessToTask = await this.taskService.checkAccess(
      taskId,
      user.userId,
    );
    if (!canAccessToTask) throw new NotFoundException();
    return this.taskService.removeTask(taskId);
  }
}
