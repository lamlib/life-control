import { Permission } from '../../modules/auth/entities/permission.entity';
import { RolePermission } from '../../modules/auth/entities/role-permission.entity';
import { Role } from '../../modules/auth/entities/role.entity';
import { BaseSeeder } from '../../shared/base/base.seeder';
import { DataSource } from 'typeorm';

export class RolePermissionSeeder extends BaseSeeder {
  constructor(private dataSource: DataSource) {
    super();
  }

  async seed(): Promise<void> {
    const permissionRepository = this.dataSource.getRepository(Permission);
    const roleRepository = this.dataSource.getRepository(Role);
    const rolePermissionRepository =
      this.dataSource.getRepository(RolePermission);

    const hasPermissions = await this.checkIfDataExits(permissionRepository);
    const hasRole = await this.checkIfDataExits(roleRepository);

    if (hasPermissions || hasRole) {
      this.log(
        'Permission or role already exits, skipping permission-role seeding',
      );
      return;
    }

    this.log('Starting permision-role seeding...');

    // Seeding permission
    let permissions = [
      'Đọc nội dung công khai',
      'Tạo nội dung',
      'Cập nhật nội dung',
      'Xóa nội dung',
      'Quản lý người dùng',
      'Quản lý quyền',
      'Quản lý hệ thống',
    ].map((description) => permissionRepository.create({ description }));
    permissions = await permissionRepository.save(permissions);
    this.log(`Seeding ${permissions.length} permissions successfully`);

    // Seeding role
    let roles = ['Admin', 'Guest', 'Client', 'Moderator'].map((description) =>
      roleRepository.create({ description }),
    );
    roles = await roleRepository.save(roles);
    this.log(`Seeding ${roles.length} roles successfully`);

    // Admin has all permissions
    const adminPermissions = permissions.map((permission) => ({
      roleId: roles[0].id,
      permissionId: permission.id,
    }));
    // Guest can only read public content
    const guestPermissions = [
      {
        roleId: roles[1].id,
        permissionId: permissions[0].id,
      },
    ];
    // Client can read and create content
    const clientPermissions = permissions.slice(0, 2).map((permission) => ({
      roleId: roles[2].id,
      permissionId: permission.id,
    }));
    // Moderator can do everything except system management
    const moderatorPermissions = permissions.slice(0, 6).map((permission) => ({
      roleId: roles[3].id,
      permissionId: permission.id,
    }));
    const rolePermissions = await rolePermissionRepository.save([
      ...adminPermissions,
      ...guestPermissions,
      ...clientPermissions,
      ...moderatorPermissions,
    ]);
    this.log(`Seeding ${rolePermissions.length} permision-role successfully`);
  }
}
