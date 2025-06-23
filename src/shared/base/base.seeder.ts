export abstract class BaseSeeder {
    abstract seed(): Promise<void>;

    protected async checkIfDataExits(repository: any, condition: any = {}): Promise<boolean> {
        const count = await repository.count(condition);
        return count > 0;
    }

    protected log(message: string): void {
        console.log(`[SEEDER] ${message}`);
    }
}