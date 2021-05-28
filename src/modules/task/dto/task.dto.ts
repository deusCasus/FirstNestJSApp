import { IsString } from 'class-validator';

export class TaskDto {
  @IsString()
  caption: string;
  @IsString()
  description: string;
}
