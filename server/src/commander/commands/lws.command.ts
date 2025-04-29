import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { LwsService } from 'src/lws/lws.service';

@Command({
  name: 'lws',
  description: 'Manage LWS webhooks',
})
export class LwsCommand extends CommandRunner {
  private logger = new Logger(LwsCommand.name);

  constructor(private readonly lwsService: LwsService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    if (options?.listAccounts) {
      const accounts = await this.lwsService.getAccounts();
      this.logger.log(JSON.stringify(accounts, null, 2));
      this.logger.log(`Total active accounts: ${accounts.active.length}`);
      return;
    }

    if (options?.list) {
      const webhooks = await this.lwsService.listWebhooks();
      console.log('Current webhooks:', JSON.stringify(webhooks, null, 2));
      return;
    }

    if (options?.listLength) {
      const res = await this.lwsService.listWebhooks();
      const webhooks = res.webhooks;

      const result = webhooks.map((webhook) => {
        return {
          user: webhook.key.user,
          length: webhook.value.length,
        };
      });
      this.logger.log(JSON.stringify(result, null, 2));
      this.logger.log(
        `Total webhooks: ${result.reduce((acc, curr) => acc + curr.length, 0)}`,
      );
      return;
    }

    if (options?.deleteAccountWebhooks) {
      const res = await this.lwsService.deleteAddressWebhooks(
        options.deleteAccountWebhooks,
      );
      this.logger.log(JSON.stringify(res, null, 2));
      return;
    }

    if (options?.deleteAllWebhooks) {
      const webhooksList = await this.lwsService.listWebhooks();
      const accounts = await this.lwsService.getAccounts();

      if (!webhooksList?.webhooks?.length) {
        this.logger.log('No webhooks found');
        return;
      }

      const userIds = [
        ...webhooksList.webhooks.map((webhook) => webhook.key.user),
      ];

      for (const userId of userIds) {
        const userIndex = userId - 1;
        if (accounts?.active?.[userIndex]) {
          const address = accounts.active[userIndex].address;
          this.logger.log(
            `Deleting webhooks for user ${userId} with address ${address}`,
          );

          try {
            const result = await this.lwsService.deleteAddressWebhooks(address);
            this.logger.log(
              `Successfully deleted webhooks for address ${address}`,
            );
          } catch (error) {
            this.logger.error(
              `Failed to delete webhooks for address ${address}: ${error.message}`,
            );
          }
        } else {
          this.logger.warn(`No matching account found for user ${userId}`);
        }
      }
    }

    // if (options?.deleteWebhook) {
    //   await this.lwsService.deleteWebhook(options.deleteWebhook);
    //   this.logger.log(
    //     `Webhook with event ID ${options.deleteWebhook} deleted successfully`,
    //   );
    //   return;
    // }

    this.logger.log('Please specify either --list or --list-length option');
  }

  @Option({
    flags: '-l, --list',
    description: 'List all webhooks',
  })
  parseList() {
    return true;
  }

  @Option({
    flags: '-a, --list-accounts',
    description: 'List all accounts',
  })
  parseAccountList() {
    return true;
  }

  @Option({
    flags: '-ll, --list-length',
    description: 'Length of all webhooks per account',
  })
  parseLength() {
    return true;
  }

  @Option({
    flags: '-d, --delete-webhook <eventId>',
    description: 'Delete webhook(s) with event ID',
  })
  parseDelete(eventId: string) {
    return eventId;
  }

  @Option({
    flags: '-da, --delete-account-webhooks <address>',
    description: 'Delete webhook(s) with address',
  })
  parseDeleteAccountWebhooks(address: string) {
    return address;
  }

  @Option({
    flags: '-daa, --delete-all-webhooks',
    description: 'Delete all webhooks',
  })
  parseDeleteAllWebhooks() {
    return true;
  }
}
