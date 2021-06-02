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
import { TaskListService, TaskService } from '../services';
import { CreateTaskDTO, EditTaskDTO, EditTaskListDTO, TaskDTO } from '../dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Work with Task')
@Controller()
export class TaskController {
  constructor(
    private taskListService: TaskListService,
    private taskService: TaskService,
  ) {}

  @ApiOperation({ summary: 'Get the task list by task list id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @ApiResponse({ type: TaskDTO, isArray: true, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('/task/:taskListId/list')
  public async getListOfTaskList(
    @User() user: UserData,
    @Param('taskListId') taskListId: number,
  ): Promise<TaskDTO[]> {
    const canAccess = await this.taskListService.checkAccess(
      taskListId,
      user.userId,
    );
    if (!canAccess) throw new NotFoundException();
    return this.taskService.getListOfTaskByTaskList(taskListId);
  }

  @ApiOperation({ summary: 'Create a task' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @ApiBody({ type: CreateTaskDTO })
  @ApiResponse({ type: TaskDTO, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/task/:taskListId/list')
  public async createTask(
    @User() user: UserData,
    @Param('taskListId') taskListId: number,
    @Body() createTaskDto: CreateTaskDTO,
  ): Promise<TaskDTO> {
    const canAccess = await this.taskListService.checkAccess(
      taskListId,
      user.userId,
    );
    if (!canAccess) throw new NotFoundException();
    return this.taskService.createTask(taskListId, createTaskDto);
  }

  @ApiOperation({ summary: 'Update the task' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @ApiBody({ type: EditTaskListDTO })
  @ApiResponse({ type: TaskDTO, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Put('/task/:taskListId/list/:taskId')
  public async updateTask(
    @User() user: UserData,
    @Param('taskListId') taskListId: number,
    @Param('taskId') taskId: number,
    @Body() editTaskDto: EditTaskDTO,
  ): Promise<TaskDTO> {
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
    return this.taskService.updateTask(taskId, editTaskDto);
  }

  @ApiOperation({ summary: 'Remove the task by ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @ApiResponse({ status: 200, description: 'Response hasn\'t body' })
  @UseGuards(JwtAuthGuard)
  @Delete('/task/:taskListId/list/:taskId')
  public async removeTask(
    @User() user: UserData,
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
