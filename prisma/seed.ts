import { PrismaClient } from "@prisma/client";
import { readdirSync } from "fs";
import path from "path";

export function* readAllFiles(dir: string): Generator<string> {
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      yield* readAllFiles(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}

const prisma = new PrismaClient();
async function main() {
  const inserts: { name: string; image: string }[] = [];

  for (const file of readAllFiles(
    path.join("public", "static", "images", "keycaps")
  )) {
    // Skip some files we MAY encounter
    if (file.endsWith(".DS_Store") || file.endsWith("Blank.png")) continue;

    const extension = path.extname(file);
    const name = path.basename(file, extension);

    inserts.push({ name, image: file.replace(/^public/, "") });
  }

  await prisma.$transaction(
    inserts.map((insert) =>
      prisma.keycap.upsert({
        where: { name: insert.name },
        update: {},
        create: insert,
      })
    )
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
