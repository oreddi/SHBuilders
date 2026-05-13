const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ 
  url: "file:./dev.db" 
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Clean up
  await prisma.task.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.project.deleteMany();

  const project1 = await prisma.project.create({
    data: {
      name: '8095 Vane Ct Custom Build',
      description: 'Luxury custom build with modern finishes.',
      phases: {
        create: [
          {
            name: 'Foundation',
            order: 1,
            tasks: {
              create: [
                { title: 'Excavation', status: 'completed' },
                { title: 'Footing Pour', status: 'completed' },
              ],
            },
          },
          {
            name: 'Framing',
            order: 2,
            tasks: {
              create: [
                { title: 'First Floor Framing', status: 'in_progress', priority: 'high' },
                { title: 'Second Floor Joists', status: 'todo' },
              ],
            },
          },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Alydar Loop Renovation',
      description: 'Full kitchen and living room remodel.',
      phases: {
        create: [
          {
            name: 'Demolition',
            order: 1,
            tasks: {
              create: [
                { title: 'Cabinet Removal', status: 'completed' },
                { title: 'Wall Removal', status: 'completed' },
              ],
            },
          },
          {
            name: 'Rough-In',
            order: 2,
            tasks: {
              create: [
                { title: 'Electrical Rough-in', status: 'blocked', priority: 'high', description: 'Waiting for permits.' },
                { title: 'Plumbing Rough-in', status: 'todo' },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
