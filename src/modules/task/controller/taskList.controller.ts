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
import { TaskListService } from '../service';
import { TaskListEntity } from '../../../entities';
import { TaskListDto } from '../dto';

@Controller()
export class TaskListController {
  constructor(private service: TaskListService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/task')
  public getListOfTaskList(@User() user: any): Promise<TaskListEntity[]> {
    return this.service.getListOfTaskListByUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/task')
  public createTaskList(
    @User() user: any,
    @Body() taskListDto: TaskListDto,
  ): Promise<TaskListEntity> {
    return this.service.createTaskList(user.userId, taskListDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/task/:taskListId')
  public async updateTaskList(
    @User() user: any,
    @Param('taskListId') taskListId: number,
    @Body() taskListDto: TaskListDto,
  ): Promise<TaskListEntity> {
    const canAccess = await this.service.checkAccess(taskListId, user.userId);
    if (!canAccess) throw new NotFoundException();
    return this.service.updateTaskList(taskListId, taskListDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/task/:taskListId')
  public async removeTaskList(
    @User() user: any,
    @Param('taskListId') taskListId: number,
  ): Promise<void> {
    const canAccess = await this.service.checkAccess(taskListId, user.userId);
    if (!canAccess) throw new NotFoundException();
    return this.service.removeTaskList(taskListId);
  }
}
