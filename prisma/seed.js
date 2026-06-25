const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('supabase') ? { rejectUnauthorized: false } : undefined
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean up in correct order (respecting foreign keys)
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.material.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.project.deleteMany();

  // ─────────────────────────────────────────
  // PROJECT 1: Vane Ct Custom Build
  // ─────────────────────────────────────────
  const project1 = await prisma.project.create({
    data: {
      name: '8095 Vane Ct Custom Build',
      description: 'Luxury 4,200 sqft custom build with modern finishes, open floor plan, and premium landscaping.',
      address: '8095 Vane Ct, Theodore, AL',
      clientName: 'The Hendersons',
      status: 'active',
      phases: {
        create: [
          {
            name: 'Site Preparation', order: 1,
            tasks: {
              create: [
                { title: 'Land survey & grading', status: 'completed', priority: 'high' },
                { title: 'Tree removal & clearing', status: 'completed' },
                { title: 'Erosion control setup', status: 'completed' },
              ],
            },
          },
          {
            name: 'Foundation', order: 2,
            tasks: {
              create: [
                { title: 'Excavation', status: 'completed', priority: 'high' },
                { title: 'Footing forms & pour', status: 'completed' },
                { title: 'Foundation walls & waterproofing', status: 'completed' },
                { title: 'Foundation inspection', status: 'completed', priority: 'high' },
              ],
            },
          },
          {
            name: 'Framing', order: 3,
            tasks: {
              create: [
                { title: 'First floor framing', status: 'in_progress', priority: 'high', assignee: 'Mike T.', description: 'Using engineered lumber per spec.' },
                { title: 'Second floor joists', status: 'todo', assignee: 'Mike T.' },
                { title: 'Roof trusses installation', status: 'todo', priority: 'high' },
                { title: 'Framing inspection', status: 'not_started' },
              ],
            },
          },
          {
            name: 'Roofing', order: 4,
            tasks: {
              create: [
                { title: 'Underlayment & ice shield', status: 'not_started' },
                { title: 'Shingle installation', status: 'not_started' },
                { title: 'Flashing & gutters', status: 'not_started' },
              ],
            },
          },
          {
            name: 'MEP (Mechanical, Electrical, Plumbing)', order: 5,
            tasks: {
              create: [
                { title: 'Electrical rough-in', status: 'not_started', priority: 'high' },
                { title: 'Plumbing rough-in', status: 'not_started', priority: 'high' },
                { title: 'HVAC ductwork', status: 'not_started' },
              ],
            },
          },
          { name: 'Insulation', order: 6 },
          { name: 'Drywall', order: 7 },
          { name: 'Finishes', order: 8 },
          { name: 'Fixtures', order: 9 },
          { name: 'Exterior', order: 10 },
          { name: 'Punch List', order: 11 },
          { name: 'Closeout', order: 12 },
        ],
      },
      materials: {
        create: [
          { name: '2x6 SPF Lumber', quantityNeeded: 450, unit: 'pieces', status: 'delivered', supplier: 'Home Depot Pro', quantityOrdered: 450, quantityOnSite: 450 },
          { name: 'Concrete (4000 PSI)', quantityNeeded: 85, unit: 'cubic_yd', status: 'installed', supplier: 'Martin Marietta', quantityOrdered: 85, quantityOnSite: 0, quantityInstalled: 85 },
          { name: 'Engineered Floor Joists', quantityNeeded: 60, unit: 'pieces', status: 'ordered', supplier: 'Weyerhaeuser', quantityOrdered: 60 },
          { name: 'Architectural Shingles', quantityNeeded: 45, unit: 'boxes', status: 'not_ordered', supplier: 'GAF' },
          { name: 'Romex 12/2 Wire', quantityNeeded: 2500, unit: 'linear_ft', status: 'not_ordered' },
        ],
      },
    },
  });

  // ─────────────────────────────────────────
  // PROJECT 2: Alydar Loop Renovation
  // ─────────────────────────────────────────
  const project2 = await prisma.project.create({
    data: {
      name: 'Alydar Loop Renovation',
      description: 'Full kitchen and living room remodel with custom white-oak cabinetry and quartz countertops.',
      address: '142 Alydar Loop, Chattanooga, TN',
      clientName: 'Sarah & James Mitchell',
      status: 'active',
      phases: {
        create: [
          {
            name: 'Demolition', order: 1,
            tasks: {
              create: [
                { title: 'Cabinet removal', status: 'completed', assignee: 'Carlos R.' },
                { title: 'Wall removal (load-bearing check)', status: 'completed', priority: 'high', assignee: 'Carlos R.' },
                { title: 'Flooring tear-out', status: 'completed' },
              ],
            },
          },
          {
            name: 'Rough-In', order: 2,
            tasks: {
              create: [
                { title: 'Electrical rough-in', status: 'blocked', priority: 'high', description: 'Waiting for electrical permit approval from city.', assignee: 'Dave L.' },
                { title: 'Plumbing rough-in', status: 'todo', assignee: 'Dave L.' },
                { title: 'HVAC modifications', status: 'todo' },
              ],
            },
          },
          {
            name: 'Finishes', order: 3,
            tasks: {
              create: [
                { title: 'Custom cabinet installation', status: 'not_started', priority: 'high', description: 'White oak, custom-milled.' },
                { title: 'Quartz countertop install', status: 'not_started' },
                { title: 'Tile backsplash', status: 'not_started' },
                { title: 'Hardwood floor install', status: 'not_started' },
              ],
            },
          },
          { name: 'Fixtures & Trim', order: 4 },
          { name: 'Punch List', order: 5 },
        ],
      },
      materials: {
        create: [
          { name: 'White Oak Cabinet Set', quantityNeeded: 1, unit: 'pieces', status: 'ordered', supplier: 'Custom Millwork Co.', quantityOrdered: 1, notes: 'Lead time: 6 weeks' },
          { name: 'Quartz Countertop Slab', quantityNeeded: 3, unit: 'pieces', status: 'quote_requested', supplier: 'Cambria' },
          { name: 'Subway Tile (3x6)', quantityNeeded: 200, unit: 'pieces', status: 'delivered', supplier: 'Floor & Decor', quantityOrdered: 200, quantityOnSite: 200 },
        ],
      },
    },
  });

  // ─────────────────────────────────────────
  // PROJECT 3: Wildwood Ave (Completed)
  // ─────────────────────────────────────────
  const project3 = await prisma.project.create({
    data: {
      name: 'Wildwood Ave Custom Home',
      description: 'Completed coastal-style 5-bedroom custom home with wrap-around porch and ocean views.',
      address: '88 Wildwood Ave, Wilmington, NC',
      clientName: 'The Patels',
      status: 'completed',
      phases: {
        create: [
          { name: 'Site Preparation', order: 1 },
          { name: 'Foundation', order: 2 },
          { name: 'Framing', order: 3 },
          { name: 'Closeout', order: 4 },
        ],
      },
    },
  });

  // ─────────────────────────────────────────
  // SEED ACTIVITY LOGS
  // ─────────────────────────────────────────
  await prisma.activity.createMany({
    data: [
      { type: 'status_change', message: 'Project "8095 Vane Ct" created with 12 phases', author: 'System', projectId: project1.id },
      { type: 'status_change', message: 'Foundation phase completed — all inspections passed', author: 'Mike T.', projectId: project1.id },
      { type: 'status_change', message: 'First floor framing started', author: 'Mike T.', projectId: project1.id },
      { type: 'material_update', message: 'Concrete delivered: 85 cubic yards', author: 'System', projectId: project1.id },
      { type: 'status_change', message: 'Project "Alydar Loop" created', author: 'System', projectId: project2.id },
      { type: 'status_change', message: 'Demolition phase completed', author: 'Carlos R.', projectId: project2.id },
      { type: 'status_change', message: 'Electrical rough-in BLOCKED — permit pending', author: 'Dave L.', projectId: project2.id },
      { type: 'assignment', message: 'Dave L. assigned to electrical and plumbing rough-in', author: 'System', projectId: project2.id },
    ],
  });

  console.log('✅ Seed data created successfully!');
  console.log(`   - ${3} projects`);
  console.log(`   - Project 1: ${project1.name}`);
  console.log(`   - Project 2: ${project2.name}`);
  console.log(`   - Project 3: ${project3.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
