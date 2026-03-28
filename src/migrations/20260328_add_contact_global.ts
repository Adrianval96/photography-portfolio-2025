import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "contact" (
     "id" serial PRIMARY KEY NOT NULL,
     "eyebrow" varchar,
     "headline" varchar NOT NULL,
     "subline" varchar,
     "location_note" varchar,
     "notification_email" varchar,
     "updated_at" timestamp(3) with time zone,
     "created_at" timestamp(3) with time zone
   )`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "contact" CASCADE`)
}
