import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_identity" (
      "id" serial PRIMARY KEY NOT NULL,
      "person_name" varchar NOT NULL,
      "job_title" varchar,
      "schema_description" varchar,
      "address_locality" varchar,
      "address_country" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    )
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "site_identity"`)
}
