import { IsString } from 'class-validator';

export class TaskListDto {
  @IsString()
  caption: string;
}
