import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dtos/create-user.dto';
import { createFinalPassword, hashPassword } from 'src/shared/utils';
import { AdminSearchUserDto } from 'src/admin/dtos/admin-search-user.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findById(id?: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  async findByEmail(email: string) {
    if (!email) return null;
    return this.repo.findOneBy({ email });
  }

  async createUser(user: CreateUserDto) {
    const passwordResult = createFinalPassword(user.password);

    const createdUser = await this.repo.create({
      username: user.email,
      email: user.email,
      password: passwordResult,
    });

    return this.repo.save(createdUser);
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('User is not found!');

    const entity = Object.assign(user, attrs);

    return this.repo.save(entity);
  }

  async searchUsers(query: AdminSearchUserDto) {
    const [users, count] = await this.repo.findAndCount({
      skip: query.offset || 0,
      take: query.limit || 20,
      order: { createdAt: 'DESC' },
      where: { isEmailVerified: true },
    });

    return { users, count };
  }

  // Is currently used in change-email command.
  async changeEmail(emailFrom: string, emailTo: string) {
    const userTo = await this.findByEmail(emailTo);
    if (userTo) throw new ConflictException(`The ${emailTo} is already used.`);

    const userFrom = await this.findByEmail(emailFrom);

    if (!userFrom)
      throw new NotFoundException(
        `User with email ${emailFrom} does not exist.`,
      );

    userFrom.email = emailTo;
    return this.repo.save(userFrom);
  }
}
