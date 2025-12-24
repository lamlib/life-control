import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class EmailStatus {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @ApiProperty({ description: 'Mô tả cho trạng thái email được thiết lập mặc định khi seed database system' })
  @Column({ type: 'varchar', length: 50, unique: true })
  description: string;
}
