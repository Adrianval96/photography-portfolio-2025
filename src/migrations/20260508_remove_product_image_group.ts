import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products"
      DROP COLUMN IF EXISTS "product_image_url",
      DROP COLUMN IF EXISTS "product_image_width",
      DROP COLUMN IF EXISTS "product_image_height";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "product_image_url" varchar,
      ADD COLUMN IF NOT EXISTS "product_image_width" numeric,
      ADD COLUMN IF NOT EXISTS "product_image_height" numeric;
  `)
}
