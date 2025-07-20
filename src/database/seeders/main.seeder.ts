import { EmailStatusSeeder } from './email-status.seeder';
import { RolePermissionSeeder } from './role-permission.seeder';
import { DataSource } from 'typeorm';

export class MainSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed(): Promise<void> {
    console.log('Starting database seeding...');
    try {
      await new RolePermissionSeeder(this.dataSource).seed();
      await new EmailStatusSeeder(this.dataSource).seed();
      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Database seeding failed:', error);
      throw error;
    }
  }
}
