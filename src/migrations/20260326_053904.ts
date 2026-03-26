import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Drop stale tables recreated by dev mode after the remove_posts_categories migration
  await db.execute(sql`DROP TABLE IF EXISTS "posts" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "posts_rels" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "posts_populated_authors" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_posts_v" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_posts_v_rels" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_posts_v_version_populated_authors" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "search" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "search_rels" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "search_categories" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_archive" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_archive" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "categories_breadcrumbs" CASCADE`)

  // Drop stale columns on shared tables
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "posts_id"`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "search_id"`)
  await db.execute(sql`ALTER TABLE "pages_rels" DROP COLUMN IF EXISTS "posts_id"`)
  await db.execute(sql`ALTER TABLE "_pages_v_rels" DROP COLUMN IF EXISTS "posts_id"`)
  await db.execute(sql`ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "posts_id"`)
  await db.execute(sql`ALTER TABLE "header_rels" DROP COLUMN IF EXISTS "posts_id"`)
  await db.execute(sql`ALTER TABLE "footer_rels" DROP COLUMN IF EXISTS "posts_id"`)

  // Drop stale enum types
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_posts_status"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum__posts_v_version_status"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_archive_populate_by"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_archive_relation_to"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_archive_populate_by"`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_archive_relation_to"`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No rollback — these tables were already removed by a previous migration
}
