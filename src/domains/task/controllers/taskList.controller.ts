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
import { User, UserData } from '../../../infra/decorators';
import { TaskListService } from '../services';
import { CreateTaskListDTO, EditTaskListDTO, TaskListDTO } from '../dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Work with TaskList')
@Controller()
export class TaskListController {
  constructor(private service: TaskListService) {}

  @ApiOperation({ summary: 'Get list of task list entities' })
  @ApiBearerAuth()
  @ApiResponse({ type: TaskListDTO, isArray: true, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('/task')
  public getListOfTaskList(@User() user: UserData): Promise<TaskListDTO[]> {
    return this.service.getListOfTaskListByUser(user.userId);
  }

  @ApiOperation({ summary: 'Create a task list' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTaskListDTO })
  @ApiResponse({ type: TaskListDTO, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/task')
  public createTaskList(
    @User() user: UserData,
    @Body() taskListDto: CreateTaskListDTO,
  ): Promise<TaskListDTO> {
    return this.service.createTaskList(user.userId, taskListDto);
  }

  @ApiOperation({ summary: 'Update the task list' })
  @ApiBearerAuth()
  @ApiBody({ type: EditTaskListDTO })
  @ApiResponse({ type: TaskListDTO, status: 200 })
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @UseGuards(JwtAuthGuard)
  @Put('/task/:taskListId')
  public async updateTaskList(
    @User() user: UserData,
    @Param('taskListId') taskListId: number,
    @Body() taskListDto: EditTaskListDTO,
  ): Promise<TaskListDTO> {
    const canAccess = await this.service.checkAccess(taskListId, user.userId);
    if (!canAccess) throw new NotFoundException();
    return this.service.updateTaskList(taskListId, taskListDto);
  }

  @ApiOperation({ summary: 'Remove the task list by ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Response hasn't body" })
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @UseGuards(JwtAuthGuard)
  @Delete('/task/:taskListId')
  public async removeTaskList(
    @User() user: UserData,
    @Param('taskListId') taskListId: number,
  ): Promise<void> {
    const canAccess = await this.service.checkAccess(taskListId, user.userId);
    if (!canAccess) throw new NotFoundException();
    return this.service.removeTaskList(taskListId);
  }
}
