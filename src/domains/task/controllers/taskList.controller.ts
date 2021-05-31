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
import { JwtAuthGuard } from '../../auth/guards';
import { User } from '../../../infra/decorators';
import { TaskListService } from '../services';
import { CreateTaskListDTO, EditTaskListDTO, TaskListDTO } from '../dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Work with TaskList')
@Controller()
export class TaskListController {
  constructor(private service: TaskListService) {}

  @ApiBearerAuth()
  @ApiResponse({ type: TaskListDTO, isArray: true, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('/task')
  public getListOfTaskList(@User() user: any): Promise<TaskListDTO[]> {
    return this.service.getListOfTaskListByUser(user.userId);
  }

  @ApiBearerAuth()
  @ApiBody({ type: CreateTaskListDTO })
  @ApiResponse({ type: TaskListDTO, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/task')
  public createTaskList(
    @User() user: any,
    @Body() taskListDto: CreateTaskListDTO,
  ): Promise<TaskListDTO> {
    return this.service.createTaskList(user.userId, taskListDto);
  }

  @ApiBearerAuth()
  @ApiBody({ type: EditTaskListDTO })
  @ApiResponse({ type: TaskListDTO, status: 200 })
  @ApiParam({ name: 'taskListId' })
  @UseGuards(JwtAuthGuard)
  @Put('/task/:taskListId')
  public async updateTaskList(
    @User() user: any,
    @Param('taskListId') taskListId: number,
    @Body() taskListDto: EditTaskListDTO,
  ): Promise<TaskListDTO> {
    const canAccess = await this.service.checkAccess(taskListId, user.userId);
    if (!canAccess) throw new NotFoundException();
    return this.service.updateTaskList(taskListId, taskListDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'taskListId' })
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
