Based on your database schema and entities, I'll help you create seed data for permissions and roles. First, let's create seeders for permissions and roles.

Here's how to implement this:

Create a new file for seeders:

import { DataSource } from 'typeorm';
import { Permission } from '../../modules/auth/entities/permission.entity';
import { Role } from '../../modules/auth/entities/role.entity';
import { RolePermission } from '../../modules/auth/entities/role-permission.entity';

export class RolesPermissionsSeeder {
    constructor(private dataSource: DataSource) {}

    async run() {
        // Seed Permissions
        const permissionRepository = this.dataSource.getRepository(Permission);
        const permissions = await permissionRepository.save([
            { description: 'Đọc nội dung công khai' },
            { description: 'Tạo nội dung' },
            { description: 'Cập nhật nội dung' },
            { description: 'Xóa nội dung' },
            { description: 'Quản lý người dùng' },
            { description: 'Quản lý quyền' },
            { description: 'Quản lý hệ thống' }
        ]);

        // Seed Roles
        const roleRepository = this.dataSource.getRepository(Role);
        const roles = await roleRepository.save([
            { description: 'Admin' },     // ID: 1
            { description: 'Guest' },     // ID: 2
            { description: 'Client' },    // ID: 3
            { description: 'Moderator' }  // ID: 4
        ]);

        // Seed Role Permissions
        const rolePermissionRepository = this.dataSource.getRepository(RolePermission);
        
        // Admin has all permissions
        const adminPermissions = permissions.map(permission => ({
            roleId: roles[0].id,
            permissionId: permission.id
        }));

        // Guest can only read public content
        const guestPermissions = [{
            roleId: roles[1].id,
            permissionId: permissions[0].id
        }];

        // Client can read and create content
        const clientPermissions = permissions.slice(0, 2).map(permission => ({
            roleId: roles[2].id,
            permissionId: permission.id
        }));

        // Moderator can do everything except system management
        const moderatorPermissions = permissions.slice(0, 6).map(permission => ({
            roleId: roles[3].id,
            permissionId: permission.id
        }));

        await rolePermissionRepository.save([
            ...adminPermissions,
            ...guestPermissions,
            ...clientPermissions,
            ...moderatorPermissions
        ]);
    }
}

Create a main seeder file:

import { DataSource } from 'typeorm';
import { RolesPermissionsSeeder } from './roles-permissions.seeder';

export class MainSeeder {
    constructor(private dataSource: DataSource) {}

    async run() {
        await new RolesPermissionsSeeder(this.dataSource).run();
        console.log('✅ Database seeding completed');
    }
}

Create a CLI command to run the seeders:

import { DataSource } from 'typeorm';
import { MainSeeder } from './seeders/main.seeder';
import configuration from '../config/configuration';

const dataSource = new DataSource({
    type: configuration().database.type as any,
    host: configuration().database.host,
    port: parseInt(configuration().database.port as string),
    username: configuration().database.username,
    password: configuration().database.password,
    database: configuration().database.name,
    entities: ['dist/**/*.entity.js'],
    synchronize: false
});

dataSource.initialize()
    .then(async () => {
        await new MainSeeder(dataSource).run();
        await dataSource.destroy();
    })
    .catch(error => console.log('Error during seeding:', error));

Add a new script in package.json:

{
  "scripts": {
    "seed": "ts-node src/database/seed.ts"
  }
}

Now you can seed the database by running:

npm run seed

This will:

Create 7 basic permissions
Create 4 roles (Admin, Guest, Client, Moderator)
Assign appropriate permissions to each role:
Admin: All permissions
Guest: Only read public content
Client: Read and create content
Moderator: Everything except system management