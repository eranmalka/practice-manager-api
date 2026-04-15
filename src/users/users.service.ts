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

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
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

  /** For login: loads hash, verifies password, returns public user fields or null. */
  async validateCredentials(
    email: string,
    plainPassword: string,
  ): Promise<{
    id: number;
    email: string;
    name: string;
    createdAt: Date;
  } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        passwordHash: true,
      },
    });
    if (!user?.passwordHash) {
      return null;
    }
    if (!bcrypt.compareSync(plainPassword, user.passwordHash)) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
