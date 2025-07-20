import { Repository } from 'typeorm';

export abstract class BaseSeeder {
  abstract seed(): Promise<void>;

  protected async checkIfDataExits(
    repository: Repository<any>,
    condition: any = {},
  ): Promise<boolean> {
    const count: number = await repository.count(condition);
    return count > 0;
  }

  protected log(message: string): void {
    console.log(`[SEEDER] ${message}`);
  }
}
