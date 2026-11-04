import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_rels" ADD COLUMN "lessons_id" integer;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_rels_lessons_id_idx" ON "users_rels" USING btree ("lessons_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_rels" DROP CONSTRAINT "users_rels_lessons_fk";
  
  DROP INDEX "users_rels_lessons_id_idx";
  ALTER TABLE "users_rels" DROP COLUMN "lessons_id";`)
}
