import { Expose, Type } from 'class-transformer';
import {
  IntegrationConfigMethod,
  IntegrationConfigType,
} from 'src/shared/constants';

export class IntegrationConfigDto {
  @Expose()
  type: IntegrationConfigType;

  @Expose()
  config: any;

  @Expose()
  method: IntegrationConfigMethod;

  @Expose()
  verified: boolean;
}

export class IntegrationsRO {
  @Expose()
  @Type(() => IntegrationConfigDto)
  integrations: IntegrationConfigDto[];
}
