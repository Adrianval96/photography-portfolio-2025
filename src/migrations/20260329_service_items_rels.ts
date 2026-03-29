import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "service_items_id" integer;`)
  await db.execute(sql`DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_items_fk" FOREIGN KEY ("service_items_id") REFERENCES "public"."service_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$`)
  await db.execute(sql`
   CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_service_items_id_idx" ON "payload_locked_documents_rels" USING btree ("service_items_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "payload_locked_documents_rels_service_items_id_idx";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_service_items_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "service_items_id";`)
}
