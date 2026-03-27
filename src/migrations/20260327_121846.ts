import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "about_section_photo_id" integer;
   ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "about_section_name" varchar;
   ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "about_section_bio" varchar;
   ALTER TABLE "homepage" ADD CONSTRAINT "homepage_about_section_photo_id_media_id_fk" FOREIGN KEY ("about_section_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   CREATE INDEX IF NOT EXISTS "homepage_about_section_photo_idx" ON "homepage" USING btree ("about_section_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "homepage_about_section_photo_idx";
   ALTER TABLE "homepage" DROP CONSTRAINT IF EXISTS "homepage_about_section_photo_id_media_id_fk";
   ALTER TABLE "homepage" DROP COLUMN IF EXISTS "about_section_photo_id";
   ALTER TABLE "homepage" DROP COLUMN IF EXISTS "about_section_name";
   ALTER TABLE "homepage" DROP COLUMN IF EXISTS "about_section_bio";`)
}
