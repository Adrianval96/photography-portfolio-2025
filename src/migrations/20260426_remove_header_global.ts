import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "header_nav_items" CASCADE;
    DROP TABLE IF EXISTS "header_rels" CASCADE;
    DROP TABLE IF EXISTS "header" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_header_nav_items_link_type";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');

    CREATE TABLE IF NOT EXISTS "header" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "header_nav_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar
    );

    CREATE TABLE IF NOT EXISTS "header_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "pages_id" integer,
      "posts_id" integer
    );

    ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade;
    ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade;

    CREATE INDEX IF NOT EXISTS "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "header_rels_order_idx" ON "header_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "header_rels_path_idx" ON "header_rels" USING btree ("path");
  `)
}
