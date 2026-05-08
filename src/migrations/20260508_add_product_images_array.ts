import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "products_product_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar,
      "width" numeric,
      "height" numeric,
      "type" varchar
    );

    ALTER TABLE "products_product_images" ADD CONSTRAINT "products_product_images_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "products_product_images_order_idx" ON "products_product_images" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "products_product_images_parent_id_idx" ON "products_product_images" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "products_product_images_parent_id_idx";
    DROP INDEX IF EXISTS "products_product_images_order_idx";
    ALTER TABLE "products_product_images" DROP CONSTRAINT IF EXISTS "products_product_images_parent_id_fk";
    DROP TABLE IF EXISTS "products_product_images" CASCADE;
  `)
}
