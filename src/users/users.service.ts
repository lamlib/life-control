import { Injectable } from '@nestjs/common';

// Đây nên là một class/interface chuẩn để đại diện cho một user entity
export type User = {
    userId: number;
    username: string;
    password: string;
};

@Injectable()
export class UsersService {
    private readonly users = [
        {
            userId: 1,
            username: 'john',
            password: 'changeme',
        },
        {
            userId: 2,
            username: '',
            password: '',
        },
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
