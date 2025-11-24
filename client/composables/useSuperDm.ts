import pgp from "micro-key-producer/pgp.js";
import { randomBytes } from "micro-key-producer/utils.js";
import { entropyToMnemonic, mnemonicToEntropy } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

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

  const recoverPrivateKey = (mnemonic: string) => {
    const recoveredSeed = mnemonicToEntropy(mnemonic, wordlist);
    const keys = pgp(recoveredSeed, "");

    return {
      privateKeyArmored: keys.privateKey,
      publicKeyArmored: keys.publicKey,
    };
  };

  const getSavedKey = async () => {
    return await idb.get<string>("super-dm-private-key");
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

  return {
    generateKeys,
    recoverPrivateKey,
    getSavedKey,
    saveKeys,
    generateAndSaveKeys,
  };
};
