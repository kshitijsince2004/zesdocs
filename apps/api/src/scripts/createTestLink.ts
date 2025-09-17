import 'dotenv/config';
import { prisma } from '../db/connection';
import { LinkService } from '../services/linkService';

async function main() {
  try {
    // Ensure there is a user to own the link (upsert by email)
    const email = 'test@example.com';
    const user = await prisma.user.upsert({
      where: { email },
      create: { email, password: 'dev-hash' },
      update: {},
    });

    const created = await LinkService.create({
      url: 'https://example.com',
      ownerId: user.id,
    });

    console.log('Created link:', created);

    const fetched = await LinkService.getById(created.id, user.id);
    console.log('Fetched link:', fetched);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
