import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "product_image_url" varchar,
      ADD COLUMN IF NOT EXISTS "product_image_width" numeric,
      ADD COLUMN IF NOT EXISTS "product_image_height" numeric;

    UPDATE "products"
      SET "product_image_url" = "image_url"
      WHERE "image_url" IS NOT NULL;

    ALTER TABLE "products"
      DROP COLUMN IF EXISTS "image_url";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "image_url" varchar;

    UPDATE "products"
      SET "image_url" = "product_image_url"
      WHERE "product_image_url" IS NOT NULL;

    ALTER TABLE "products"
      DROP COLUMN IF EXISTS "product_image_url",
      DROP COLUMN IF EXISTS "product_image_width",
      DROP COLUMN IF EXISTS "product_image_height";
  `)
}
