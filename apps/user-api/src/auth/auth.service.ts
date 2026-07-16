import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (user && user.password) {
      const isValid = await bcrypt.compare(pass, user.password);
      if (isValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async validateGoogleUser(profile: any): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { email: profile.email },
    });

    if (user) {
      if (!user.googleId || !user.authType) {
        return await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: profile.googleId,
            authType: 'Google',
          },
        });
      }
      return user;
    } else {
      const token = crypto.randomBytes(16).toString('hex');
      return await this.prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          googleId: profile.googleId,
          authType: 'Google',
          balance: {
            create: {
              amount: 5999900,
              locked: 0,
            },
          },
          onRampTransactions: {
            create: {
              startTime: new Date(),
              status: 'Success',
              amount: 5999900,
              token,
              provider: 'HDFC Bank',
            },
          },
        },
      });
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, number: user.number };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(data: any) {
    const { name, email, password, number } = data;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ name }, { email }, { number }],
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      if (existingUser.email === email) {
        if (existingUser.googleId && !existingUser.password) {
          const updatedUser = await this.prisma.user.update({
            where: { id: existingUser.id },
            data: {
              password: hashedPassword,
              number: number,
            },
          });
          return this.login(updatedUser);
        } else {
          throw new BadRequestException('Email already exists');
        }
      }
      if (existingUser.name === name) {
        throw new BadRequestException('Username already exists');
      }
      if (existingUser.number === number) {
        throw new BadRequestException('Number already exists');
      }
    }

    const token = crypto.randomBytes(16).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        number: number,
        balance: {
          create: {
            amount: 5999900,
            locked: 0,
          },
        },
        onRampTransactions: {
          create: {
            startTime: new Date(),
            status: 'Success',
            amount: 5999900,
            token,
            provider: 'HDFC Bank',
          },
        },
      },
    });

    return this.login(user);
  }
}
