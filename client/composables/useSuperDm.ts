import pgp from "micro-key-producer/pgp.js";
import { randomBytes } from "micro-key-producer/utils.js";
import { entropyToMnemonic, mnemonicToEntropy } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import * as openpgp from "openpgp";
import type { GeneratedKeys, SavedViewerSuperDmKeys } from "~/types";

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
  const saveViewerKeys = async (params: {
    superDmId: string;
    pagePath: string;
    generatedKeys: GeneratedKeys;
  }) => {
    let savedPageKeys = await idb.get(`super-dm-${params.pagePath}`);
    savedPageKeys = savedPageKeys || [];

    savedPageKeys.push({
      superDmId: params.superDmId,
      recoveryKey: params.generatedKeys.mnemonic,
      privateKeyArmored: params.generatedKeys.privateKeyArmored,
      publicKeyArmored: params.generatedKeys.publicKeyArmored,
    });

    await idb.set(`super-dm-${params.pagePath}`, savedPageKeys);
  };

  const getViewerSavedKeys = async (params: { pagePath: string }) => {
    return await idb.get<SavedViewerSuperDmKeys[]>(
      `super-dm-${params.pagePath}`
    );
  };

  const getViewerSavedKey = async (params: {
    pagePath: string;
    superDmId: string;
  }) => {
    const savedKeys = await idb.get<SavedViewerSuperDmKeys[]>(
      `super-dm-${params.pagePath}`
    );
    return savedKeys?.find((k) => k.superDmId === params.superDmId);
  };

  // GENERAL
  const generateMessage = async (params: {
    streamerPublicKeyArmored?: string;
    superDmPublicKeyArmored?: string;
    privateKeyArmored?: string;
    message?: string;
  }) => {
    if (
      !params.streamerPublicKeyArmored ||
      !params.superDmPublicKeyArmored ||
      !params.privateKeyArmored ||
      !params.message
    )
      throw createError("Keys are not found or invalid");

    const streamerPublicKey = await openpgp.readKey({
      armoredKey: params.streamerPublicKeyArmored,
    });
    const superDmPublicKey = await openpgp.readKey({
      armoredKey: params.superDmPublicKeyArmored,
    });
    const privateKey = await openpgp.readPrivateKey({
      armoredKey: params.privateKeyArmored,
    });

    const createdMessage = await openpgp.createMessage({
      text: params.message,
    });
    const date = new Date().toISOString();

    const encryptedMessageArmored = await openpgp.encrypt({
      message: createdMessage,
      encryptionKeys: [superDmPublicKey, streamerPublicKey],
    });

    const signatureObject = { armoredMessage: encryptedMessageArmored, date };
    const signatureText = JSON.stringify(signatureObject);
    const signatureMessage = await openpgp.createMessage({
      text: signatureText,
    });

    const signature = await openpgp.sign({
      message: signatureMessage,
      signingKeys: [privateKey],
      detached: true,
    });

    return {
      content: encryptedMessageArmored,
      date,
      signature,
    };
  };

  return {
    generateKeys,
    recoverKeys,
    getStreamerSavedKey,
    saveStreamerKeys,
    generateAndSaveStreamerKeys,
    validateSamePrivateKeys,
    saveViewerKeys,
    getViewerSavedKeys,
    getViewerSavedKey,
    generateMessage,
  };
};
