import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ExternalAccount {
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: 'FK trỏ tới offical account của system này' })
  @Column()
  accountId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  externalProviderId: string;

  @ApiProperty({ description: 'Mã định danh người dùng do provider cung cấp' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  externalAccountId: string;

  @ApiProperty({ description: 'Địa chỉ email người dùng do provider cung cấp' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  externalAccountEmailAdress: string;

  @ApiProperty({ description: 'Tên tài khoản người dùng do provider cung cấp (chỉ lấy về, tạm thời để đấy và không làm gì cả)' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  externalAccountName: string;

  @ApiProperty({ description: 'Link ảnh avatar người dùng do provider cung cấp (chỉ lấy về, tạm thời để đấy và không làm gì cả)' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  externalAccountAvatar: string;
}
