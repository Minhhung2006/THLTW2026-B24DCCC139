import { PrismaClient, Role, TournamentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import process from "process";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ── Admin User (Includes Organizer capabilities) ─────────────
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@esports.com" },
    update: {},
    create: {
      email: "admin@esports.com",
      password: adminPassword,
      fullName: "System Admin",
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ── Regular User ────────────────────────────────────────────
  const userPassword = await bcrypt.hash("User@123", 10);
  const user = await prisma.user.upsert({
    where: { email: "player@esports.com" },
    update: {},
    create: {
      email: "player@esports.com",
      password: userPassword,
      fullName: "Pro Player",
      role: Role.USER,
    },
  });
  console.log(`✅ Regular user: ${user.email}`);

  // ── Sample Tournament (Organized by Admin) ───────────────────
  const tournament = await prisma.tournament.upsert({
    where: { id: "seed-tournament-001" },
    update: {},
    create: {
      id: "seed-tournament-001",
      name: "VN Esports Championship 2026",
      description: "The biggest esports tournament in Vietnam for 2026.",
      game: "League of Legends",
      format: "single_elimination",
      status: TournamentStatus.UPCOMING,
      maxTeams: 16,
      prizePool: 50000000,
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-06-30"),
      registrationDeadline: new Date("2026-05-25"),
      rules: "Standard Riot Games tournament rules apply.",
      organizerId: admin.id, // Admin is the organizer
    },
  });
  console.log(`✅ Tournament: ${tournament.name}`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
