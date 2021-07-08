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
import { TaskCommentService, TaskService } from '../services';
import { CreateTaskCommentDTO, EditTaskCommentDTO, TaskCommentDTO } from '../dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Work with Comment for Task')
@Controller()
export class TaskCommentController {
  constructor(
    private taskService: TaskService,
    private taskCommentService: TaskCommentService
  ) {}

  @ApiOperation({ summary: 'Get the comment list by task id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @ApiParam({ name: 'taskId', description: 'ID for the task inside taskList' })
  @ApiResponse({ type: TaskCommentDTO, isArray: true, status: 200 })

  @Get('/task/:taskListId/list/:taskId/comments')
  @UseGuards(JwtAuthGuard)
  public async getListOfComment(
    @User() user: UserData,
    @Param('taskId') taskId: number,
  ): Promise<TaskCommentDTO[]> {
    const canAccess = await this.taskService.checkAccess(
      taskId,
      user.userId,
    );
    if (!canAccess) throw new NotFoundException();
    return this.taskCommentService.getListByTask(taskId);
  }

  @ApiOperation({ summary: 'Create a comment for task' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @ApiBody({ type: CreateTaskCommentDTO })
  @ApiResponse({ type: TaskCommentDTO, status: 200 })

  @Post('/task/:taskListId/list/:taskId/comments')
  @UseGuards(JwtAuthGuard)
  public async createComment(
    @User() user: UserData,
    @Param('taskId') taskId: number,
    @Body() createTaskCommentDTO: CreateTaskCommentDTO,
  ): Promise<TaskCommentDTO> {
    const canAccess = await this.taskService.checkAccess(
      taskId,
      user.userId,
    );
    if (!canAccess) throw new NotFoundException();
    return this.taskCommentService.createComment(
      taskId,
      user.userId,
      createTaskCommentDTO
    );
  }

  @ApiOperation({ summary: 'Update the comment' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @ApiParam({ name: 'taskCommentId', description: 'ID for the comment' })
  @ApiBody({ type: EditTaskCommentDTO })
  @ApiResponse({ type: TaskCommentDTO, status: 200 })

  @UseGuards(JwtAuthGuard)
  @Put('/task/:taskListId/list/:taskId/comments/:taskCommentId')
  public async updateTask(
    @User() user: UserData,
    @Param('taskCommentId') taskCommentId: number,
    @Body() editTaskCommentDTO: EditTaskCommentDTO,
  ): Promise<TaskCommentDTO> {
    const canAccessToTask = await this.taskCommentService.checkAccess(
      taskCommentId,
      user.userId,
    );

    if (!canAccessToTask) throw new NotFoundException();
    return this.taskCommentService.updateComment(taskCommentId, editTaskCommentDTO);
  }

  @ApiOperation({ summary: 'Remove the task comment by ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'taskListId', description: 'ID for the task list' })
  @ApiParam({ name: 'taskId', description: 'ID for the task' })
  @ApiParam({ name: 'taskCommentId', description: 'ID for the comment' })
  @ApiResponse({ status: 200, description: "Response hasn't body" })

  @Delete('/task/:taskListId/list/:taskId/comments/:taskCommentId')
  @UseGuards(JwtAuthGuard)
  public async removeTask(
    @User() user: UserData,
    @Param('taskCommentId') taskCommentId: number,
  ): Promise<void> {
    const canAccessToTask = await this.taskCommentService.checkAccess(
      taskCommentId,
      user.userId,
    );
    if (!canAccessToTask) throw new NotFoundException();
    return this.taskCommentService.removeComment(taskCommentId);
  }
}
