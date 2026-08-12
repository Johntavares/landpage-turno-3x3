import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_tU3ovAi8TpwS@ep-fancy-breeze-acc3grwc-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require');

async function testAccessLog() {
  try {
    console.log('Testing insertion into AccessLog table...');
    await sql`
      INSERT INTO "AccessLog" (user_email, team, timestamp, is_offline, platform)
      VALUES ('operador.teste@turno3x3.com', 'B', ${new Date().toISOString()}, true, 'Android (PWA)')
    `;

    const logs = await sql`
      SELECT id, user_email as "userEmail", team, timestamp, is_offline as "isOffline", platform
      FROM "AccessLog"
      ORDER BY id DESC
      LIMIT 10
    `;
    console.log('AccessLogs result:', logs);
  } catch (err) {
    console.error('Error inserting access log:', err);
  }
}

testAccessLog();
