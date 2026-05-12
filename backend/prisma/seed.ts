import { PrismaClient, Role, TournamentStatus, RegistrationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear existing data
  await prisma.regMember.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  // 1. Create Users (3 ADMIN, 10 USER)
  const admins = [];
  for (let i = 1; i <= 3; i++) {
    const admin = await prisma.user.create({
      data: {
        username: `admin${i}`,
        email: `admin${i}@example.com`,
        password: passwordHash,
        role: Role.ADMIN,
      },
    });
    admins.push(admin);
  }

  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: passwordHash,
        role: Role.USER,
      },
    });
    users.push(user);
  }

  console.log("Created users.");

  // 2. Create Tournaments (5 tournaments created by admin1)
  const tournaments = [];
  for (let i = 1; i <= 5; i++) {
    const tournament = await prisma.tournament.create({
      data: {
        name: `Tournament ${i}`,
        game: i % 2 === 0 ? "League of Legends" : "Valorant",
        description: `Description for Tournament ${i}`,
        startDate: new Date(new Date().getTime() + i * 86400000), // Future date
        endDate: new Date(new Date().getTime() + (i + 5) * 86400000),
        maxTeams: 8,
        status: i === 1 ? TournamentStatus.ONGOING : TournamentStatus.UPCOMING,
        createdById: admins[0].id,
      },
    });
    tournaments.push(tournament);
  }

  console.log("Created tournaments.");

  // 3. Create Registrations (15 registrations spread across users and tournaments)
  // We will loop and assign registrations
  let registrationCount = 0;
  for (let i = 0; i < 5; i++) { // 5 tournaments
    const currentTournament = tournaments[i];
    
    // Each tournament gets 3 registrations from first 3 users
    for (let j = 0; j < 3; j++) {
      const currentUser = users[j];
      
      const statusOptions = [RegistrationStatus.APPROVED, RegistrationStatus.PENDING, RegistrationStatus.REJECTED];
      
      const registration = await prisma.registration.create({
        data: {
          tournamentId: currentTournament.id,
          userId: currentUser.id,
          teamName: `Team ${currentUser.username} - T${i+1}`,
          status: statusOptions[j % 3], // Mix statuses
          members: {
            create: [
              { memberName: `${currentUser.username}_player1`, gameId: `gameid_${j}_1` },
              { memberName: `${currentUser.username}_player2`, gameId: `gameid_${j}_2` },
              { memberName: `${currentUser.username}_player3`, gameId: `gameid_${j}_3` },
              { memberName: `${currentUser.username}_player4`, gameId: `gameid_${j}_4` },
              { memberName: `${currentUser.username}_player5`, gameId: `gameid_${j}_5` },
            ]
          }
        }
      });
      registrationCount++;
    }
  }

  console.log(`Created ${registrationCount} registrations with members.`);
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
