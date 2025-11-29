import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class SuperDmSettingsService {
  async savePublicKey(publicKey: string, user: User) {}
}
