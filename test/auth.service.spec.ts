import { AuthService } from '../src/auth/auth.service';
describe('AuthService', () => {
  it('requires explicit consent when registering', async () => {
    const service = new AuthService({ exists: jest.fn() } as never, { sign: jest.fn() } as never, {} as never);
    await expect(service.register({ email: 'test@example.com', password: 'password', firstName: 'Test', consent: false })).rejects.toThrow('consent');
  });
});
