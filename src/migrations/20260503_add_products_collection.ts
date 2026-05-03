import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_products_status" AS ENUM('synced', 'archived');

    CREATE TABLE IF NOT EXISTS "products" (
      "id" serial PRIMARY KEY NOT NULL,
      "printful_sync_product_id" numeric NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar,
      "slug_lock" boolean DEFAULT true,
      "status" "enum_products_status" NOT NULL DEFAULT 'synced',
      "image_url" varchar,
      "last_synced_at" timestamp(3) with time zone,
      "featured" boolean DEFAULT false,
      "sort_order" numeric DEFAULT 0,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "products_variants" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "printful_variant_id" numeric NOT NULL,
      "format" varchar NOT NULL,
      "price" numeric NOT NULL
    );

    ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "products_id" integer;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk"
      FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX IF NOT EXISTS "products_printful_sync_product_id_idx" ON "products" USING btree ("printful_sync_product_id");
    CREATE INDEX IF NOT EXISTS "products_slug_idx" ON "products" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "products_updated_at_idx" ON "products" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "products_variants_order_idx" ON "products_variants" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_products_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_products_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "products_id";
    DROP TABLE IF EXISTS "products_variants" CASCADE;
    DROP TABLE IF EXISTS "products" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_products_status";
  `)
}
