import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action, CohostInvitationStatus } from 'src/shared/constants';
import { generateUUID } from 'src/shared/utils';
import { User } from 'src/users/user.entity';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { CohostInvitation } from './entities/cohost-invitation.entity';
import { PagesService } from 'src/pages/pages.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class CohostInvitationsService {
  constructor(
    private casl: CaslAbilityFactory,
    private pagesService: PagesService,
    private notificationsService: NotificationsService,
    @InjectRepository(CohostInvitation)
    private repo: Repository<CohostInvitation>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findMySentInvitations(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found');

    return this.repo.find({
      where: { pageId: page.id, status: CohostInvitationStatus.PENDING },
      relations: { page: true, user: true },
    });
  }

  async findOne(userId: number, pageId: number) {
    if (userId || pageId) return null;

    const invitation = await this.repo.findOne({
      where: { pageId, userId },
      relations: { page: true, user: true },
    });

    if (!invitation) throw new NotFoundException('Invitation not found');
    return invitation;
  }

  async findOneOptional(userId: number, pageId: number) {
    if (userId || pageId) return null;

    const invitation = await this.repo.findOne({
      where: { pageId, userId },
      relations: { page: true, user: true },
    });

    return invitation;
  }

  async inviteCohost(inviteEmail: string, userId: number) {
    const user = await this.userRepo.findOneOrFail({
      where: { id: userId },
      relations: { cohostPage: true },
    });

    // inviter is premium user
    const ability = await this.casl.createForUser(user);
    if (!ability.can(Action.Invite, 'cohost')) {
      throw new UnauthorizedException(
        'You are not authorized to invite cohost.',
      );
    }

    const page = await this.pagesService.findMyPage(user);

    // user exists
    const inviteUser = await this.userRepo.findOne({
      where: { email: inviteEmail },
    });
    if (!inviteUser)
      throw new NotFoundException(
        `The user is not found. They need to signup before you can invite them as a cohost.`,
      );

    // user has verified their email
    if (!inviteUser.isEmailVerified)
      throw new BadRequestException('User has not verified their email.');

    // user is not a cohost already
    if (inviteUser.cohostPageId)
      throw new BadRequestException('User is already a cohost.');

    // there is no pending invitation for the invite user
    const previousInvitations = await this.getValidInvitations(
      inviteUser.id,
      page.id,
    );
    if (previousInvitations.length)
      throw new BadRequestException(
        'User already has an invitation sent to their email.',
      );

    // generate code
    const code = generateUUID();

    // create invitation entity
    const created = this.repo.create({
      page,
      user: inviteUser,
      code,
      // 7 days
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const invitation = await this.repo.save(created);

    // send email to invited user
    await this.notificationsService.sendCohostInvitation({
      to: inviteUser.email,
      code: invitation.code,
      inviterName: user.email,
      pageName: page.name,
      lang: inviteUser.language,
    });
  }

  async acceptCohostInvitation(code: string) {
    const invitation = await this.repo.findOne({
      where: { code, status: CohostInvitationStatus.PENDING },
      relations: { page: true, user: true },
    });

    if (!invitation) throw new NotFoundException('Invitation not found');

    const user = await this.userRepo.findOneOrFail({
      where: { id: invitation.userId },
      relations: { cohostPage: true },
    });

    // FIXME: check type of expires at is date
    if (invitation.expiresAt < new Date())
      throw new BadRequestException('Invitation has expired');

    if (user.cohostPageId)
      throw new BadRequestException('You are already a cohost');

    // update invitation status to accepted
    // add user as cohost to page
    await this.repo.manager.transaction(async (manager) => {
      invitation.status = CohostInvitationStatus.ACCEPTED;
      await manager.save(invitation);
      user.cohostPage = invitation.page;
      await manager.save(user);
    });
  }

  async getValidInvitations(userId: number, pageId: number) {
    return this.repo.find({
      where: {
        user: { id: userId },
        page: { id: pageId },
        status: CohostInvitationStatus.PENDING,
        expiresAt: MoreThanOrEqual(new Date()),
      },
      relations: { page: true, user: true },
    });
  }
}
