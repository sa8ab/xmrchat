import { IntegrationConfig } from './integration-configs.entity';

export interface IIntegrationVerifier {
  requestVerification(config: IntegrationConfig): Promise<void>;
  confirmVerification(
    config: IntegrationConfig,
    candidate: string,
  ): Promise<void>;
}
