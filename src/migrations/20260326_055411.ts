import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "categories" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" USING btree ("created_at")`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "categories_id" integer`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_categories_fk"`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id")`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_categories_fk"`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_categories_id_idx"`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "categories_id"`)
  await db.execute(sql`DROP TABLE IF EXISTS "categories" CASCADE`)
}
