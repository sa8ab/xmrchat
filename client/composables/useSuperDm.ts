import pgp from "micro-key-producer/pgp.js";
import { randomBytes } from "micro-key-producer/utils.js";
import { entropyToMnemonic, mnemonicToEntropy } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import * as openpgp from "openpgp";

interface GeneratedKeys {
  mnemonic: string;
  privateKeyArmored: string;
  publicKeyArmored: string;
}

export const useSuperDm = () => {
  const idb = useIdb();

  // Generates new keys
  const generateKeys = () => {
    const seed = randomBytes(32);
    const mnemonic = entropyToMnemonic(seed, wordlist);

    const keys = pgp(seed, "");

    return {
      mnemonic,
      privateKeyArmored: keys.privateKey,
      publicKeyArmored: keys.publicKey,
    };
  };

  const recoverKeys = (mnemonic: string) => {
    const recoveredSeed = mnemonicToEntropy(mnemonic, wordlist);
    const keys = pgp(recoveredSeed, "");

    return {
      mnemonic,
      privateKeyArmored: keys.privateKey,
      publicKeyArmored: keys.publicKey,
    };
  };

  const validateSamePrivateKeys = async (
    publicKeyArmored: string,
    savedPublicKeyArmored: string
  ) => {
    const key = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const savedKey = await openpgp.readKey({
      armoredKey: savedPublicKeyArmored,
    });

    const fingerprint = key.getFingerprint();
    const savedFingerprint = savedKey.getFingerprint();

    return fingerprint === savedFingerprint;
  };

  // STREAMER
  const getStreamerSavedKey = async () => {
    return await idb.get<GeneratedKeys>("super-dm-keys");
  };

  const saveStreamerKeys = async (params: GeneratedKeys) => {
    await idb.set("super-dm-keys", {
      mnemonic: params.mnemonic,
      privateKeyArmored: params.privateKeyArmored,
      publicKeyArmored: params.publicKeyArmored,
    });
  };

  const generateAndSaveStreamerKeys = async () => {
    const keys = generateKeys();
    await saveStreamerKeys(keys);
    return keys;
  };

  // VIEWER

  return {
    generateKeys,
    recoverKeys,
    getSavedKey: getStreamerSavedKey,
    saveKeys: saveStreamerKeys,
    generateAndSaveKeys: generateAndSaveStreamerKeys,
    validateSamePrivateKeys,
  };
};
