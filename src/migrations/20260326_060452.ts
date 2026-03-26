import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "portfolio_items" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "media_id" integer NOT NULL,
    "description" jsonb,
    "location" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  )`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "portfolio_items_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "categories_id" integer
  )`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "portfolio_items_id" integer`)
  await db.execute(sql`ALTER TABLE "portfolio_items" DROP CONSTRAINT IF EXISTS "portfolio_items_media_id_media_id_fk"`)
  await db.execute(sql`ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`)
  await db.execute(sql`ALTER TABLE "portfolio_items_rels" DROP CONSTRAINT IF EXISTS "portfolio_items_rels_parent_fk"`)
  await db.execute(sql`ALTER TABLE "portfolio_items_rels" ADD CONSTRAINT "portfolio_items_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action`)
  await db.execute(sql`ALTER TABLE "portfolio_items_rels" DROP CONSTRAINT IF EXISTS "portfolio_items_rels_categories_fk"`)
  await db.execute(sql`ALTER TABLE "portfolio_items_rels" ADD CONSTRAINT "portfolio_items_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_items_media_idx" ON "portfolio_items" USING btree ("media_id")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_items_updated_at_idx" ON "portfolio_items" USING btree ("updated_at")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_items_created_at_idx" ON "portfolio_items" USING btree ("created_at")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_items_rels_order_idx" ON "portfolio_items_rels" USING btree ("order")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_items_rels_parent_idx" ON "portfolio_items_rels" USING btree ("parent_id")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_items_rels_path_idx" ON "portfolio_items_rels" USING btree ("path")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "portfolio_items_rels_categories_id_idx" ON "portfolio_items_rels" USING btree ("categories_id")`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_portfolio_items_fk"`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_items_fk" FOREIGN KEY ("portfolio_items_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_portfolio_items_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_items_id")`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "portfolio_items_rels" DROP CONSTRAINT IF EXISTS "portfolio_items_rels_categories_fk"`)
  await db.execute(sql`ALTER TABLE "portfolio_items_rels" DROP CONSTRAINT IF EXISTS "portfolio_items_rels_parent_fk"`)
  await db.execute(sql`ALTER TABLE "portfolio_items" DROP CONSTRAINT IF EXISTS "portfolio_items_media_id_media_id_fk"`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_portfolio_items_fk"`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_portfolio_items_id_idx"`)
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_items" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "portfolio_items_rels" CASCADE`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "portfolio_items_id"`)
}
