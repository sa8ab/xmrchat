import { Client, ClientConfig } from 'pg';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import axios from 'axios';
import * as FormData from 'form-data';

import * as dotenv from 'dotenv';

dotenv.config();

const IMAGES_PATH = './source-uploads';

const sourceConfig: ClientConfig = {
  host: process.env.SOURCE_DATABASE_HOST,
  port: +process.env.SOURCE_DATABASE_PORT,
  user: process.env.SOURCE_DATABASE_USERNAME,
  password: process.env.SOURCE_DATABASE_PASSWORD,
  database: process.env.SOURCE_DATABASE_NAME,
};

const targetConfig: ClientConfig = {
  host: process.env.TARGET_DATABASE_HOST,
  port: +process.env.TARGET_DATABASE_PORT,
  user: process.env.TARGET_DATABASE_USERNAME,
  password: process.env.TARGET_DATABASE_PASSWORD,
  database: process.env.TARGET_DATABASE_NAME,
};


const sourceClient = new Client(sourceConfig);
const targetClient = new Client(targetConfig);

const connectClients = async () => {
  await sourceClient.connect();
  await targetClient.connect();
  sourceClient.query('SELECT 1 + 1');
  targetClient.query('SELECT 1 + 1');
  console.log('Connected');
};

const saveMappings = async (
  mappings: Map<string, number>,
  filename: string,
) => {
  const arrayMappings = Array.from(mappings, ([sourceId, targetId]) => ({
    sourceId,
    targetId,
  }));

  fs.writeFileSync(filename, JSON.stringify(arrayMappings, null, 2));
};

const loadMappings = async (filename: string) => {
  const data = fs.readFileSync(filename, 'utf-8');
  const arrayMappings: Array<{ sourceId: number; targetId: number }> =
    JSON.parse(data);

  return new Map<string, number>(
    arrayMappings.map(({ sourceId, targetId }) => [
      sourceId.toString(),
      targetId,
    ]),
  );
};

const maybeLoadFile = (path: string) => {
  try {
    fs.readFileSync(path);
    const file = fs.createReadStream(path);
    return file;
  } catch (error) {
    return undefined;
  }
};

const loadFile = (name: string) => {
  const pngFile = maybeLoadFile(`${IMAGES_PATH}/${name}.png`);
  if (pngFile) return pngFile;

  const jpgFile = maybeLoadFile(`${IMAGES_PATH}/${name}.jpeg`);
  if (jpgFile) return jpgFile;

  return undefined;
};

const uploadAndGetImageId = async (file: any) => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await axios.post(
    `http://${process.env.TARGET_DATABASE_HOST}:3083/upload/image/page-logo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data.file.id;
};

const migrateImages = async () => {
  try {
    console.log('Migrate images start');

    const logoIdMappings = new Map<string, number>();
    const bannerIdMappings = new Map<string, number>();

    const { rows: pages } = await sourceClient.query(
      `SELECT * FROM pages ORDER BY creation`,
    );

    for (const page of pages) {
      console.log('Uploading logo of', page.path, 'page');

      const logoFile = loadFile(page.logo);

      if (!logoFile) continue;

      const uploadedId = await uploadAndGetImageId(logoFile);

      logoIdMappings.set(page.id, uploadedId);
    }

    for (const page of pages) {
      console.log('Uploading cover image of', page.path);

      const bannerFile = loadFile(page.cover_image);

      if (!bannerFile) continue;

      const uploadedId = await uploadAndGetImageId(bannerFile);

      bannerIdMappings.set(page.id, uploadedId);
    }

    await saveMappings(logoIdMappings, 'migrations/data/logoIdMappings.json');
    await saveMappings(
      bannerIdMappings,
      'migrations/data/bannerIdMappings.json',
    );

    console.log('Migrate image end');
  } catch (error) {
    console.log(error);
  }
};

const migrateUsers = async () => {
  const userIdMappings = new Map<string, number>();
  try {
    console.log('Migrate user start');

    const res = await sourceClient.query(
      'SELECT * FROM users ORDER BY creation',
    );
    const users = res.rows;

    const queryValues = users
      .map(
        (_, index) =>
          `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`,
      )
      .join(',');

    const insertValues = users.flatMap((user) => [
      user.username,
      `${user.password_salt}.${user.password}`,
      user.email,
      user.is_email_verified,
      user.creation,
    ]);

    const { rows } = await targetClient.query(
      `
        INSERT INTO users (username, password, email, is_email_verified, created_at)
        VALUES ${queryValues} returning id
        `,
      insertValues,
    );

    users.forEach((user, index) => {
      userIdMappings.set(user.id, rows[index].id);
    });

    await saveMappings(userIdMappings, 'migrations/data/userIdMappings.json');

    console.log('Migrate user end');
  } catch (error) {
    console.log(error);
  }
};

const migratePages = async () => {
  const pageIdMappings = new Map<string, number>();
  try {
    console.log('Migrating Pages');

    const userIdMappings = await loadMappings(
      'migrations/data/userIdMappings.json',
    );
    const logoIdMappings = await loadMappings(
      'migrations/data/logoIdMappings.json',
    );
    const bannerIdMappings = await loadMappings(
      'migrations/data/bannerIdMappings.json',
    );

    const { rows: pages } = await sourceClient.query(
      `SELECT * FROM pages ORDER BY creation`,
    );

    const queryValues = pages
      .map(
        (_, index) =>
          `($${index * 11 + 1}, $${index * 11 + 2}, $${index * 11 + 3}, $${index * 11 + 4}, $${index * 11 + 5}, $${index * 11 + 6}, $${index * 11 + 7}, $${index * 11 + 8}, $${index * 11 + 9}, $${index * 11 + 10}, $${index * 11 + 11})`,
      )
      .join(',');

    const insertValues = pages.flatMap((page) => [
      page.path,
      page.path,
      '',
      page.payment_address,
      page.view_key,
      page.twitch_channel,
      page.isPublic,
      userIdMappings.get(page.user_id),
      page.creation,
      logoIdMappings.get(page.id),
      bannerIdMappings.get(page.id),
    ]);

    const { rows } = await targetClient.query(
      `
      INSERT INTO pages (name, path, description, primary_address, secret_view_key, twitch_channel, is_public, user_id, created_at, logo_id, cover_image_id)
      VALUES ${queryValues} returning id
      `,
      insertValues,
    );

    pages.forEach((page, index) => {
      pageIdMappings.set(page.id, rows[index].id);
    });

    await saveMappings(pageIdMappings, 'migrations/data/pageIdMappings.json');

    console.log('Migrate pages end');
  } catch (error) {
    console.log(error);
  }
};

const migrateTips = async () => {
  console.log('Migrating Tips');

  try {
    const pageIdMappings = await loadMappings(
      'migrations/data/pageIdMappings.json',
    );

    const { rows: tips } = await sourceClient.query(
      'SELECT * FROM tips ORDER BY creation',
    );

    const queryValues = tips
      .map(
        (_, index) =>
          `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`,
      )
      .join(',');

    const insertValues = tips.flatMap((tip) => [
      tip.name,
      tip.message || '',
      tip.private,
      pageIdMappings.get(tip.page_id),
      tip.creation,
    ]);

    const { rows: tipRows } = await targetClient.query(
      `
      INSERT INTO tips (name, message, private, page_id, created_at)
      VALUES ${queryValues} returning id
      `,
      insertValues,
    );

    // PAYMENTS
    const paymentQueryValues = tips
      .map(
        (_, index) =>
          `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`,
      )
      .join(',');

    const paymentInsertValues = tips.flatMap((tip, index) => [
      tipRows[index].id,
      'GENERATED_' + randomUUID(),
      tip.amount,
      tip.paid_amount || '0',
      tip.paid_at,
    ]);

    await targetClient.query(
      `
      INSERT INTO payments (tip_id, event_id, amount, paid_amount, paid_at)
      VALUES ${paymentQueryValues} returning id
      `,
      paymentInsertValues,
    );

    console.log('Migrating Tips End');
  } catch (error) {
    console.log(error);
  }
};

const migratePageTiers = async () => {
  console.log('Page Tier migration start');

  try {
    const pageIdMappings = await loadMappings(
      'migrations/data/pageIdMappings.json',
    );

    const { rows: sourceTiers } = await sourceClient.query(
      `SELECT * FROM page_tiers`,
    );

    const queryValues = sourceTiers.map(
      (_, index) =>
        `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`,
    );
    const insertValues = sourceTiers.flatMap((tier) => [
      pageIdMappings.get(tier.page_id),
      tier.name,
      tier.description || '',
      tier.amount,
    ]);

    await targetClient.query(
      `
      INSERT INTO tiers (page_id, name, description, amount)
      VALUES ${queryValues} returning id
      `,
      insertValues,
    );

    console.log('Page Tier migration end');
  } catch (error) {
    console.log(error);
  }
};

const start = async () => {
  await connectClients();
  await migrateImages();
  await migrateUsers();
  await migratePages();
  await migrateTips();
  await migratePageTiers();
};

start();
