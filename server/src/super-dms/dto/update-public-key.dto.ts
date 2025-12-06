import { IsEncryptionPublicKey } from 'src/shared/validations/encryption-public-key.validator';

export class UpdatePublicKeyDto {
  @IsEncryptionPublicKey()
  publicKey: string;
}
