import * as openpgp from 'openpgp';

export const verifySignature = async (params: {
  message: string;
  signature: string;
  publicKeyArmored: string;
  date: string;
}) => {
  const signature = await openpgp.readSignature({
    armoredSignature: params.signature,
  });
  const publicKey = await openpgp.readKey({
    armoredKey: params.publicKeyArmored,
  });
  const verifyResult = await openpgp.verify({
    message: await openpgp.createMessage({ text: params.message }),
    signature,
    verificationKeys: [publicKey],
  });

  await verifyResult.signatures[0].verified;
};
