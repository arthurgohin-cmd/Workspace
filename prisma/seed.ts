import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env");
  }

  const existingAdmin = await db.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.adminUser.create({ data: { email: adminEmail, passwordHash } });
    console.log(`Compte admin créé : ${adminEmail}`);
  } else {
    console.log(`Compte admin déjà existant : ${adminEmail}`);
  }

  // --- Projets connus (contenu à compléter dans l'admin) ---
  const projects: Parameters<typeof db.project.create>[0]["data"][] = [
    {
      slug: "appartement-paris",
      title: "Appartement Paris",
      city: "PARIS",
      location: "Paris",
      status: "IN_PROGRESS",
      propertyType: "Appartement",
      summary: "Rénovation en cours — descriptif à compléter.",
      description: "",
      featured: true,
      order: 1,
    },
    {
      slug: "villa-castellaras",
      title: "Villa Castellaras",
      city: "CANNES",
      location: "Castellaras, Mouans-Sartoux",
      status: "IN_PROGRESS",
      propertyType: "Villa",
      summary: "Rénovation en cours — descriptif à compléter.",
      description: "",
      featured: true,
      order: 2,
    },
    {
      slug: "villa-miami",
      title: "Villa Miami",
      city: "MIAMI",
      location: "Miami",
      status: "IN_PROGRESS",
      propertyType: "Villa",
      summary: "Rénovation en cours — descriptif à compléter.",
      description: "",
      featured: true,
      order: 3,
    },
    {
      slug: "residence-miami-i",
      title: "Résidence Miami I",
      city: "MIAMI",
      location: "Miami",
      status: "COMPLETED",
      propertyType: "Résidence",
      summary: "Projet livré — descriptif à compléter.",
      description: "",
      featured: true,
      order: 4,
    },
    {
      slug: "residence-miami-ii",
      title: "Résidence Miami II",
      city: "MIAMI",
      location: "Miami",
      status: "COMPLETED",
      propertyType: "Résidence",
      summary: "Projet livré — descriptif à compléter.",
      description: "",
      featured: false,
      order: 5,
    },
    {
      slug: "villa-mandelieu-la-napoule",
      title: "Villa Mandelieu-la-Napoule",
      city: "CANNES",
      location: "Mandelieu-la-Napoule, 06210",
      status: "COMPLETED",
      propertyType: "Villa",
      summary: "Projet livré — descriptif à compléter.",
      description: "",
      featured: true,
      order: 6,
    },
  ];

  for (const project of projects) {
    await db.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }
  console.log(`${projects.length} projets vérifiés/créés.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
