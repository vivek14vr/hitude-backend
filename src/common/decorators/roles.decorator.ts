import { SetMetadata } from '@nestjs/common';
export enum Role { CUSTOMER = 'customer', ADMIN = 'admin', SUPER_ADMIN = 'super_admin', SUPPORT = 'support_staff', DOCTOR = 'doctor_verification_staff' }
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
