import { EmailStatus } from '../../modules/users/entities/email-status.entity';
import { BaseSeeder } from '../../shared/base/base.seeder';
import { DataSource } from 'typeorm';

export class EmailStatusSeeder extends BaseSeeder {
  constructor(private dataSource: DataSource) {
    super();
  }

  async seed(): Promise<void> {
    const emailStatusRepository = this.dataSource.getRepository(EmailStatus);
    const hasEmailStatus = await this.checkIfDataExits(emailStatusRepository);
    if (hasEmailStatus) {
      this.log('Email status already exists, skipping email status seeding');
      return;
    }
    this.log('Starting email status seeding...');
    let emailStatus = [
      'Chưa xác thực email',
      'Đang chờ xác thực email',
      'Đã xác thực email thành công',
      'Link xác thực email đã hết hạn',
      'Xác thực thất bại',
    ].map((description) => emailStatusRepository.create({ description }));
    emailStatus = await emailStatusRepository.save(emailStatus);
    this.log(`Seeding ${emailStatus.length} email status successfully`);
  }
}
