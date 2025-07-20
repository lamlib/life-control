import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: false })
  refreshTokenExpire: Date;

  @Column({ type: 'int', nullable: false })
  accountId: number;
}
