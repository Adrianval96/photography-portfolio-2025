import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

// This migration was a no-op — site_settings table already existed and is
// owned by payloadCloudPlugin. The slug collision has been resolved by
// renaming our global to social-links (see 20260414_add_social_links).
export async function up(_args: MigrateUpArgs): Promise<void> {}
export async function down(_args: MigrateDownArgs): Promise<void> {}
