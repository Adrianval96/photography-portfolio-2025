import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "feature_flags" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "enabled" boolean DEFAULT false,
    "description" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  )`)

  await db.execute(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS "feature_flags_key_idx" ON "feature_flags" USING btree ("key")`,
  )
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS "feature_flags_updated_at_idx" ON "feature_flags" USING btree ("updated_at")`,
  )
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS "feature_flags_created_at_idx" ON "feature_flags" USING btree ("created_at")`,
  )

  await db.execute(
    sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "feature_flags_id" integer`,
  )
  await db.execute(
    sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_feature_flags_fk"`,
  )
  await db.execute(
    sql`ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feature_flags_fk" FOREIGN KEY ("feature_flags_id") REFERENCES "public"."feature_flags"("id") ON DELETE cascade ON UPDATE no action`,
  )
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_feature_flags_id_idx" ON "payload_locked_documents_rels" USING btree ("feature_flags_id")`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "feature_flags" CASCADE`)
  await db.execute(
    sql`ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_feature_flags_fk"`,
  )
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_feature_flags_id_idx"`)
  await db.execute(
    sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "feature_flags_id"`,
  )
}
