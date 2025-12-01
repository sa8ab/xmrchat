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

  // Recovers keys from mnemonic
  const recoverKeys = (mnemonic: string) => {
    const recoveredSeed = mnemonicToEntropy(mnemonic, wordlist);
    const keys = pgp(recoveredSeed, "");

    return {
      mnemonic,
      privateKeyArmored: keys.privateKey,
      publicKeyArmored: keys.publicKey,
    };
  };

  const getSavedKey = async () => {
    return await idb.get<GeneratedKeys>("super-dm-keys");
  };

  // Saves keys to idb
  const saveKeys = async (params: GeneratedKeys) => {
    await idb.set("super-dm-keys", {
      mnemonic: params.mnemonic,
      privateKeyArmored: params.privateKeyArmored,
      publicKeyArmored: params.publicKeyArmored,
    });
  };

  // Generates new keys and saves them to idb
  const generateAndSaveKeys = async () => {
    const keys = generateKeys();
    await saveKeys(keys);
    return keys;
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

  return {
    generateKeys,
    recoverKeys,
    getSavedKey,
    saveKeys,
    generateAndSaveKeys,
    validateSamePrivateKeys,
  };
};
