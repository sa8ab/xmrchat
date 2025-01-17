import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dtos/auth.dto';
import { UsersService } from 'src/users/users.service';
import { createFinalPassword, hashPassword } from 'src/shared/utils';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserTokenType } from 'src/shared/constants/enum';
import { UserTokensService } from './user-tokens/user-tokens.service';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private userTokensService: UserTokensService,
  ) {}

  async signup(authDto: AuthDto) {
    const current = await this.usersService.findByEmail(authDto.email);

    if (current) throw new BadRequestException('User already exists.');

    const user = await this.usersService.createUser(authDto);

    if (!user) throw new BadRequestException('User could not be created');

    const { token } = await this.userTokensService.createToken({
      userId: user.id,
      type: UserTokenType.EMAIL_VERIFICATION,
    });

    this.logger.log(`Token: ${token}`);

    this.notificationsService.sendVerificationEmail(user.email, token);

    return {
      message: 'Please verify your email using the link sent to your inbox.',
    };
  }

  async login(authDto: AuthDto) {
    const user = await this.usersService.findByEmail(authDto.email);

    if (!user) throw new BadRequestException('Username/Password is incorrect.');

    const [salt, storedHash] = user.password.split('.');

    const hash = hashPassword(authDto.password, salt);

    if (storedHash != hash)
      throw new BadRequestException('Username/Password is incorrect.');

    if (!user.isEmailVerified) {
      let token: string;
      try {
        const { token: result } = await this.userTokensService.createToken({
          userId: user.id,
          type: UserTokenType.EMAIL_VERIFICATION,
        });
        token = result;
      } catch (error) {
        throw new BadRequestException(
          'We have already sent you a verification email. Please follow the link in the email to login. You can request new verification email after few minutes.',
        );
      }

      this.notificationsService.sendVerificationEmail(user.email, token);

      throw new BadRequestException(
        `We have just sent you another verification email on ${user.email}. Please click the link in the verification email to login.`,
      );
    }

    const token = await this.generateJwt(user.id, user.email);

    return {
      access_token: token,
    };
  }

  async verifyEmail(token: string) {
    const userToken = await this.userTokensService.validateToken(
      token,
      UserTokenType.EMAIL_VERIFICATION,
    );

    await this.usersService.update(userToken.userId, {
      isEmailVerified: true,
    });

    await this.userTokensService.remove(userToken.id);

    return { message: 'Your account is verified.' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user)
      return {
        message:
          'Email is sent to your mailbox if you were already registered.',
      };

    let token: string;
    try {
      const { token: result } = await this.userTokensService.createToken({
        userId: user.id,
        type: UserTokenType.RESET_PASSWORD,
      });

      token = result;
    } catch (error) {
      throw new BadRequestException(
        'We have already sent you a verification email. Follow the link in the email or try again after few minutes.',
      );
    }

    this.logger.log(`Token: ${token}`);

    this.notificationsService.sendResetPasswordEmail(user.email, token);

    return {
      message: 'Email is sent to your mailbox if you were already registered.',
    };
  }

  async resetPassword(token: string, password: string) {
    const userToken = await this.userTokensService.validateToken(
      token,
      UserTokenType.RESET_PASSWORD,
    );

    const passwordResult = createFinalPassword(password);

    await this.usersService.update(userToken.userId, {
      password: passwordResult,
      isEmailVerified: true,
    });

    await this.userTokensService.remove(userToken.id);

    return {
      message: 'Password is changed successfully.',
    };
  }

  async getUser(id: number) {
    return this.usersService.findById(id);
  }

  generateJwt(userId: number, email: string) {
    return this.jwtService.signAsync({ userId, email });
  }
}
