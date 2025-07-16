import { Expose, Type } from 'class-transformer';
import { IntegrationConfigType } from 'src/shared/constants';

export class IntegrationConfigDto {
  @Expose()
  type: IntegrationConfigType;

  @Expose()
  config: any;

  @Expose()
  verified: boolean;
}

export class IntegrationsRO {
  @Expose()
  @Type(() => IntegrationConfigDto)
  integrations: IntegrationConfigDto[];
}
