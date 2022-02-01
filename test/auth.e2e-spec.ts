import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/auth/entities/user.entity';
import { AuthModule } from '../src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './../src/auth/repository/user.repository';
import { AuthService } from './../src/auth/services/auth.service';
import { JwtStrategy } from './../src/auth/strategies/jwt-strategy';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository;

  beforeEach(async () => {
    jest.resetModules();
    process.env.JWT_SECRET = 'JWT_SECRET';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [User],
          logging: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserRepository]),
        JwtModule.registerAsync({
          useFactory: async () => ({
            secret: 'JWT_SECRET',
            signOptions: {
              expiresIn: 3600,
            },
          }),
        }),
      ],
      providers: [AuthService, JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await userRepository.query('DELETE FROM user');
  });

  describe('health endpoint', () => {
    it('/', () => {});
  });
});
