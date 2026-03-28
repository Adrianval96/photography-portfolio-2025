import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "background_image_id" integer;
   ALTER TABLE "contact" ADD CONSTRAINT "contact_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   CREATE INDEX IF NOT EXISTS "contact_background_image_idx" ON "contact" USING btree ("background_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "contact_background_image_idx";
   ALTER TABLE "contact" DROP CONSTRAINT IF EXISTS "contact_background_image_id_media_id_fk";
   ALTER TABLE "contact" DROP COLUMN IF EXISTS "background_image_id";`)
}
