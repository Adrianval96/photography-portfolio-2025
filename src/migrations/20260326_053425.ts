import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Drop and recreate to ensure a clean schema — the old table may have stale columns from a previous dev mode push
  await db.execute(sql`DROP TABLE IF EXISTS "categories" CASCADE`)
  await db.execute(sql`CREATE TABLE "categories" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  )`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "categories_id"`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer`)
  await db.execute(sql`CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at")`)
  await db.execute(sql`CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at")`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action`)
  await db.execute(sql`CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id")`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "categories" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_categories_fk";
  
  DROP INDEX "payload_locked_documents_rels_categories_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";`)
}
