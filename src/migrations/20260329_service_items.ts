import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "service_items" (
     "id" serial PRIMARY KEY NOT NULL,
     "title" varchar NOT NULL,
     "text" varchar NOT NULL,
     "order" numeric NOT NULL DEFAULT 0,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
   CREATE INDEX IF NOT EXISTS "service_items_order_idx" ON "service_items" USING btree ("order");
   CREATE INDEX IF NOT EXISTS "service_items_created_at_idx" ON "service_items" USING btree ("created_at");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "service_items" CASCADE`)
}
