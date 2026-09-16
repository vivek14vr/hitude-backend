import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
@Injectable()
export class UsersService { constructor(@InjectModel(User.name) private readonly users: Model<UserDocument>) {} async me(id: string) { const user = await this.users.findById(id).select('-passwordHash -failedLoginAttempts -lockedUntil'); if (!user) throw new NotFoundException('User not found'); return user; } async requestDeletion(id: string) { await this.users.findByIdAndUpdate(id, { deletionRequested: true }); return { ok: true }; } }

