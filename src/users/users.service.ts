import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  instrument: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: publicUserSelect,
    });
  }

  async create(dto: CreateUserDto) {
    const passwordHash = bcrypt.hashSync(dto.password, 10);
    try {
      return await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          instrument: dto.instrument,
          passwordHash,
        },
        select: publicUserSelect,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Email already registered');
      }
      this.logger.error(
        'User create failed (see Prisma / DB / bcrypt)',
        e instanceof Error ? e.stack : String(e),
      );
      throw e;
    }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async updateProfile(id: number, dto: UpdateUserDto) {
    const data: { name?: string; instrument?: string; passwordHash?: string } =
      {};

    if (dto.name) {
      data.name = dto.name;
    }
    if (dto.instrument !== undefined) {
      data.instrument = dto.instrument;
    }
    if (dto.password) {
      data.passwordHash = bcrypt.hashSync(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    });
  }

  /** For login: loads hash, verifies password, returns public user fields or null. */
  async validateCredentials(
    email: string,
    plainPassword: string,
  ): Promise<{
    id: number;
    email: string;
    name: string;
    instrument: string | null;
    createdAt: Date;
  } | null> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: {
        ...publicUserSelect,
        passwordHash: true,
      },
    });
    if (!user?.passwordHash) {
      return null;
    }
    if (!bcrypt.compareSync(plainPassword, user.passwordHash)) {
      return null;
    }
    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }

  /** Link OAuth provider to existing user or create new user (password optional). */
  async findOrCreateOAuthUser(
    provider: 'google' | 'facebook',
    providerId: string,
    email: string,
    name: string,
  ): Promise<{ id: number; email: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const displayName =
      name.trim() || normalizedEmail.split('@')[0] || 'Musician';

    if (provider === 'google') {
      const byGoogle = await this.prisma.user.findFirst({
        where: { googleId: providerId },
        select: { id: true, email: true },
      });
      if (byGoogle) {
        return byGoogle;
      }
    } else {
      const byFb = await this.prisma.user.findFirst({
        where: { facebookId: providerId },
        select: { id: true, email: true },
      });
      if (byFb) {
        return byFb;
      }
    }

    const byEmail = await this.prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });
    if (byEmail) {
      return this.prisma.user.update({
        where: { id: byEmail.id },
        data:
          provider === 'google'
            ? { googleId: providerId }
            : { facebookId: providerId },
        select: { id: true, email: true },
      });
    }

    return this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name: displayName,
        googleId: provider === 'google' ? providerId : null,
        facebookId: provider === 'facebook' ? providerId : null,
        passwordHash: null,
        instrument: null,
      },
      select: { id: true, email: true },
    });
  }
}
