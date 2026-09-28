import { AuthService } from '../src/auth/auth.service';
import * as bcrypt from 'bcrypt';
describe('AuthService', () => {
  it('requires explicit consent when registering', async () => {
    const service = new AuthService({ exists: jest.fn() } as never, { sign: jest.fn() } as never, {} as never);
    await expect(service.register({ email: 'test@example.com', password: 'password', firstName: 'Test', consent: false })).rejects.toThrow('consent');
  });

  it('rejects login until the email is verified', async () => {
    const user = {
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('password', 4),
      emailVerified: false,
      failedLoginAttempts: 0,
      save: jest.fn(),
    };
    const service = new AuthService({ findOne: jest.fn().mockResolvedValue(user) } as never, {} as never, {} as never);
    await expect(service.login('test@example.com', 'password')).rejects.toThrow('verify your email');
  });
});
