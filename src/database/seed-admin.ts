import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { Role } from '../common/decorators/roles.decorator';
import { User, UserDocument } from './schemas/user.schema';

const PLACEHOLDER_PASSWORD = 'replace-before-seeding';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const role = process.env.ADMIN_ROLE ?? Role.SUPER_ADMIN;

  if (!email || !password || password === PLACEHOLDER_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and a unique ADMIN_PASSWORD in backend/.env before seeding an admin.');
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters long.');
  }
  if (!Object.values(Role).includes(role as Role)) {
    throw new Error(`ADMIN_ROLE must be one of: ${Object.values(Role).join(', ')}.`);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const users = app.get<Model<UserDocument>>(getModelToken(User.name));
    await users.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          firstName: process.env.ADMIN_FIRST_NAME ?? 'HITUDE Admin',
          role,
          emailVerified: true,
          passwordHash: await bcrypt.hash(password, 12),
          failedLoginAttempts: 0,
          lockedUntil: undefined,
          deletionRequested: false,
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    console.log(`Admin upserted: ${email}`);
  } finally {
    await app.close();
  }
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
