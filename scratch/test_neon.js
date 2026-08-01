const { neon } = require('@neondatabase/serverless');

const NEON_URL = 'postgresql://neondb_owner:npg_tU3ovAi8TpwS@ep-fancy-breeze-acc3grwc-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(NEON_URL);

async function main() {
  console.log('Connecting to Neon PostgreSQL database...');
  
  // Criar tabelas se ainda não existirem
  await sql`
    CREATE TABLE IF NOT EXISTS "Profile" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "team" TEXT DEFAULT 'A',
      "base_date" TEXT DEFAULT '2026-07-01',
      "theme" TEXT DEFAULT 'system',
      "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "Vacation" (
      "id" TEXT PRIMARY KEY,
      "user_id" TEXT NOT NULL,
      "start_date" TEXT NOT NULL,
      "end_date" TEXT NOT NULL,
      "note" TEXT,
      "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "Ad" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "image_url" TEXT NOT NULL,
      "link" TEXT NOT NULL,
      "active" BOOLEAN DEFAULT true,
      "display_order" INT DEFAULT 1,
      "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('NEON POSTGRESQL TABLES CREATED SUCCESSFULLY!');

  // Testar inserção do anúncio padrão de EPIs se a tabela estiver vazia
  const ads = await sql`SELECT count(*) FROM "Ad"`;
  if (parseInt(ads[0].count, 10) === 0) {
    await sql`
      INSERT INTO "Ad" (id, title, image_url, link, active, display_order)
      VALUES (
        'ad_epi_1',
        'Equipamentos e EPIs de Mineração',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
        'https://github.com/Johntavares/MineMesh-Tracker',
        true,
        1
      )
    `;
    console.log('Default Ad inserted into Neon DB!');
  }
}

main().catch(console.error);
