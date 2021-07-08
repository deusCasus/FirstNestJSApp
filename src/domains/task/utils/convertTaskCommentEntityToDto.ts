import { TaskCommentEntity } from '../../../entities';
import { TaskCommentDTO } from '../dto';

export const convertTaskCommentEntityToDto = (
  entity: TaskCommentEntity
): TaskCommentDTO => ({
  id: entity.id,
  content: entity.content,
  creatorId: entity.creatorId,
  taskId: entity.taskId
})
