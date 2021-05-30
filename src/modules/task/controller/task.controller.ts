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
import { CreateTaskDTO, EditTaskDTO, EditTaskListDTO, TaskDTO } from '../dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Work with Task')
@Controller()
export class TaskController {
  constructor(
    private taskListService: TaskListService,
    private taskService: TaskService,
  ) {}

  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId' })
  @ApiResponse({ type: TaskDTO, isArray: true, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('/task/:taskListId/list')
  public async getListOfTaskList(
    @User() user: any,
    @Param('taskListId') taskListId: number,
  ): Promise<TaskDTO[]> {
    const canAccess = await this.taskListService.checkAccess(
      taskListId,
      user.userId,
    );
    if (!canAccess) throw new NotFoundException();
    return this.taskService.getListOfTaskByTaskList(taskListId);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId' })
  @ApiBody({ type: CreateTaskDTO })
  @ApiResponse({ type: TaskDTO, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/task/:taskListId/list')
  public async createTask(
    @User() user: any,
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

  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId' })
  @ApiParam({ name: 'taskId' })
  @ApiBody({ type: EditTaskListDTO })
  @ApiResponse({ type: TaskDTO, status: 200 })
  @UseGuards(JwtAuthGuard)
  @Put('/task/:taskListId/list/:taskId')
  public async updateTask(
    @User() user: any,
    @Param('taskListId') taskListId: number,
    @Param('taskId') taskId: number,
    @Body() editTaskDto: EditTaskDTO,
  ): Promise<TaskDTO> {
    const canAccessToTaskList = await this.taskListService.checkAccess(
      taskListId,
      user.userId,
    );
    console.log('canAccessToTaskList ', canAccessToTaskList);
    if (!canAccessToTaskList) throw new NotFoundException();
    const canAccessToTask = await this.taskService.checkAccess(
      taskId,
      user.userId,
    );
    console.log('canAccessToTask ', canAccessToTask);
    if (!canAccessToTask) throw new NotFoundException();
    return this.taskService.updateTask(taskId, editTaskDto);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId' })
  @ApiParam({ name: 'taskId' })
  @ApiResponse({ status: 200 })
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
