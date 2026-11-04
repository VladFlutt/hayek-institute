import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__courses_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__courses_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_lessons_kind" AS ENUM('lecture', 'seminar', 'guest', 'text');
  CREATE TYPE "public"."enum_lessons_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lessons_v_version_kind" AS ENUM('lecture', 'seminar', 'guest', 'text');
  CREATE TYPE "public"."enum__lessons_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lessons_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_resources_kind" AS ENUM('book', 'article', 'video', 'homework', 'other');
  CREATE TYPE "public"."enum_access_codes_scope" AS ENUM('courses', 'all');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'translator', 'student');
  CREATE TYPE "public"."enum_users_locale" AS ENUM('ru', 'en');
  CREATE TABLE "levels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"cover_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "levels_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "courses_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "courses_outcomes_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"level_id" integer,
  	"order" numeric DEFAULT 0,
  	"cover_id" integer,
  	"cover_prompt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_courses_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "courses_locales" (
  	"title" varchar,
  	"year" varchar,
  	"teacher" varchar DEFAULT 'Павел Усанов',
  	"tagline" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_courses_v_version_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_outcomes_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_courses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_level_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_cover_id" integer,
  	"version_cover_prompt" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__courses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__courses_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_courses_v_locales" (
  	"version_title" varchar,
  	"version_year" varchar,
  	"version_teacher" varchar DEFAULT 'Павел Усанов',
  	"version_tagline" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "lessons_timecodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"at" varchar
  );
  
  CREATE TABLE "lessons_timecodes_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "lessons_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "lessons_questions_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "lessons_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "lessons_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "lessons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"course_id" integer,
  	"kind" "enum_lessons_kind" DEFAULT 'lecture',
  	"number" numeric,
  	"slug" varchar,
  	"order" numeric,
  	"date" varchar,
  	"free" boolean,
  	"youtube_url" varchar,
  	"cover_id" integer,
  	"transcript" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lessons_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "lessons_locales" (
  	"title" varchar,
  	"guest_name" varchar,
  	"summary" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_lessons_v_version_timecodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"at" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_lessons_v_version_timecodes_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_lessons_v_version_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_lessons_v_version_questions_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_lessons_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_lessons_v_version_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_lessons_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_course_id" integer,
  	"version_kind" "enum__lessons_v_version_kind" DEFAULT 'lecture',
  	"version_number" numeric,
  	"version_slug" varchar,
  	"version_order" numeric,
  	"version_date" varchar,
  	"version_free" boolean,
  	"version_youtube_url" varchar,
  	"version_cover_id" integer,
  	"version_transcript" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lessons_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__lessons_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_lessons_v_locales" (
  	"version_title" varchar,
  	"version_guest_name" varchar,
  	"version_summary" varchar,
  	"version_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_resources_kind" DEFAULT 'book',
  	"file_id" integer,
  	"url" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resources_locales" (
  	"title" varchar NOT NULL,
  	"author" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "resources_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "glossary" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "glossary_locales" (
  	"term" varchar NOT NULL,
  	"definition" varchar NOT NULL,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "access_codes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"scope" "enum_access_codes_scope" DEFAULT 'courses' NOT NULL,
  	"max_uses" numeric DEFAULT 1 NOT NULL,
  	"uses" numeric DEFAULT 0,
  	"expires_at" timestamp(3) with time zone,
  	"buyer" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "access_codes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'student' NOT NULL,
  	"all_access" boolean DEFAULT false,
  	"tutor_usage_day" varchar,
  	"tutor_usage_count" numeric DEFAULT 0,
  	"locale" "enum_users_locale" DEFAULT 'ru',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"levels_id" integer,
  	"courses_id" integer,
  	"lessons_id" integer,
  	"resources_id" integer,
  	"glossary_id" integer,
  	"access_codes_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"documents_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "assistant_charter" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"daily_limit" numeric DEFAULT 30,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "assistant_charter_locales" (
  	"charter" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "levels" ADD CONSTRAINT "levels_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "levels_locales" ADD CONSTRAINT "levels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_outcomes" ADD CONSTRAINT "courses_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_outcomes_locales" ADD CONSTRAINT "courses_outcomes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_outcomes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_locales" ADD CONSTRAINT "courses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_outcomes" ADD CONSTRAINT "_courses_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_outcomes_locales" ADD CONSTRAINT "_courses_v_version_outcomes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v_version_outcomes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_parent_id_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_level_id_levels_id_fk" FOREIGN KEY ("version_level_id") REFERENCES "public"."levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v_locales" ADD CONSTRAINT "_courses_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_timecodes" ADD CONSTRAINT "lessons_timecodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_timecodes_locales" ADD CONSTRAINT "lessons_timecodes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons_timecodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_questions" ADD CONSTRAINT "lessons_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_questions_locales" ADD CONSTRAINT "lessons_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_links" ADD CONSTRAINT "lessons_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons_links_locales" ADD CONSTRAINT "lessons_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lessons" ADD CONSTRAINT "lessons_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lessons_locales" ADD CONSTRAINT "lessons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lessons_v_version_timecodes" ADD CONSTRAINT "_lessons_v_version_timecodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lessons_v_version_timecodes_locales" ADD CONSTRAINT "_lessons_v_version_timecodes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v_version_timecodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lessons_v_version_questions" ADD CONSTRAINT "_lessons_v_version_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lessons_v_version_questions_locales" ADD CONSTRAINT "_lessons_v_version_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v_version_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lessons_v_version_links" ADD CONSTRAINT "_lessons_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lessons_v_version_links_locales" ADD CONSTRAINT "_lessons_v_version_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v_version_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_parent_id_lessons_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lessons_v_locales" ADD CONSTRAINT "_lessons_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_locales" ADD CONSTRAINT "resources_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_rels" ADD CONSTRAINT "resources_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_locales" ADD CONSTRAINT "glossary_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "access_codes_rels" ADD CONSTRAINT "access_codes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."access_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "access_codes_rels" ADD CONSTRAINT "access_codes_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "access_codes_rels" ADD CONSTRAINT "access_codes_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_levels_fk" FOREIGN KEY ("levels_id") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_access_codes_fk" FOREIGN KEY ("access_codes_id") REFERENCES "public"."access_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assistant_charter_locales" ADD CONSTRAINT "assistant_charter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."assistant_charter"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "levels_slug_idx" ON "levels" USING btree ("slug");
  CREATE INDEX "levels_cover_idx" ON "levels" USING btree ("cover_id");
  CREATE INDEX "levels_updated_at_idx" ON "levels" USING btree ("updated_at");
  CREATE INDEX "levels_created_at_idx" ON "levels" USING btree ("created_at");
  CREATE UNIQUE INDEX "levels_locales_locale_parent_id_unique" ON "levels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "levels_locales_parent_id_idx" ON "levels_locales" USING btree ("_parent_id");
  CREATE INDEX "courses_outcomes_order_idx" ON "courses_outcomes" USING btree ("_order");
  CREATE INDEX "courses_outcomes_parent_id_idx" ON "courses_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_outcomes_locales_locale_parent_id_unique" ON "courses_outcomes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "courses_outcomes_locales_parent_id_idx" ON "courses_outcomes_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");
  CREATE INDEX "courses_level_idx" ON "courses" USING btree ("level_id");
  CREATE INDEX "courses_cover_idx" ON "courses" USING btree ("cover_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX "courses__status_idx" ON "courses" USING btree ("_status");
  CREATE UNIQUE INDEX "courses_locales_locale_parent_id_unique" ON "courses_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "courses_locales_parent_id_idx" ON "courses_locales" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_outcomes_order_idx" ON "_courses_v_version_outcomes" USING btree ("_order");
  CREATE INDEX "_courses_v_version_outcomes_parent_id_idx" ON "_courses_v_version_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_courses_v_version_outcomes_locales_locale_parent_id_unique" ON "_courses_v_version_outcomes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_courses_v_version_outcomes_locales_parent_id_idx" ON "_courses_v_version_outcomes_locales" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_parent_idx" ON "_courses_v" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_version_slug_idx" ON "_courses_v" USING btree ("version_slug");
  CREATE INDEX "_courses_v_version_version_level_idx" ON "_courses_v" USING btree ("version_level_id");
  CREATE INDEX "_courses_v_version_version_cover_idx" ON "_courses_v" USING btree ("version_cover_id");
  CREATE INDEX "_courses_v_version_version_updated_at_idx" ON "_courses_v" USING btree ("version_updated_at");
  CREATE INDEX "_courses_v_version_version_created_at_idx" ON "_courses_v" USING btree ("version_created_at");
  CREATE INDEX "_courses_v_version_version__status_idx" ON "_courses_v" USING btree ("version__status");
  CREATE INDEX "_courses_v_created_at_idx" ON "_courses_v" USING btree ("created_at");
  CREATE INDEX "_courses_v_updated_at_idx" ON "_courses_v" USING btree ("updated_at");
  CREATE INDEX "_courses_v_snapshot_idx" ON "_courses_v" USING btree ("snapshot");
  CREATE INDEX "_courses_v_published_locale_idx" ON "_courses_v" USING btree ("published_locale");
  CREATE INDEX "_courses_v_latest_idx" ON "_courses_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_courses_v_locales_locale_parent_id_unique" ON "_courses_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_courses_v_locales_parent_id_idx" ON "_courses_v_locales" USING btree ("_parent_id");
  CREATE INDEX "lessons_timecodes_order_idx" ON "lessons_timecodes" USING btree ("_order");
  CREATE INDEX "lessons_timecodes_parent_id_idx" ON "lessons_timecodes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "lessons_timecodes_locales_locale_parent_id_unique" ON "lessons_timecodes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lessons_timecodes_locales_parent_id_idx" ON "lessons_timecodes_locales" USING btree ("_parent_id");
  CREATE INDEX "lessons_questions_order_idx" ON "lessons_questions" USING btree ("_order");
  CREATE INDEX "lessons_questions_parent_id_idx" ON "lessons_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "lessons_questions_locales_locale_parent_id_unique" ON "lessons_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lessons_questions_locales_parent_id_idx" ON "lessons_questions_locales" USING btree ("_parent_id");
  CREATE INDEX "lessons_links_order_idx" ON "lessons_links" USING btree ("_order");
  CREATE INDEX "lessons_links_parent_id_idx" ON "lessons_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "lessons_links_locales_locale_parent_id_unique" ON "lessons_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lessons_links_locales_parent_id_idx" ON "lessons_links_locales" USING btree ("_parent_id");
  CREATE INDEX "lessons_course_idx" ON "lessons" USING btree ("course_id");
  CREATE INDEX "lessons_slug_idx" ON "lessons" USING btree ("slug");
  CREATE INDEX "lessons_cover_idx" ON "lessons" USING btree ("cover_id");
  CREATE INDEX "lessons_updated_at_idx" ON "lessons" USING btree ("updated_at");
  CREATE INDEX "lessons_created_at_idx" ON "lessons" USING btree ("created_at");
  CREATE INDEX "lessons__status_idx" ON "lessons" USING btree ("_status");
  CREATE UNIQUE INDEX "lessons_locales_locale_parent_id_unique" ON "lessons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lessons_locales_parent_id_idx" ON "lessons_locales" USING btree ("_parent_id");
  CREATE INDEX "_lessons_v_version_timecodes_order_idx" ON "_lessons_v_version_timecodes" USING btree ("_order");
  CREATE INDEX "_lessons_v_version_timecodes_parent_id_idx" ON "_lessons_v_version_timecodes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_lessons_v_version_timecodes_locales_locale_parent_id_unique" ON "_lessons_v_version_timecodes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_lessons_v_version_timecodes_locales_parent_id_idx" ON "_lessons_v_version_timecodes_locales" USING btree ("_parent_id");
  CREATE INDEX "_lessons_v_version_questions_order_idx" ON "_lessons_v_version_questions" USING btree ("_order");
  CREATE INDEX "_lessons_v_version_questions_parent_id_idx" ON "_lessons_v_version_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_lessons_v_version_questions_locales_locale_parent_id_unique" ON "_lessons_v_version_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_lessons_v_version_questions_locales_parent_id_idx" ON "_lessons_v_version_questions_locales" USING btree ("_parent_id");
  CREATE INDEX "_lessons_v_version_links_order_idx" ON "_lessons_v_version_links" USING btree ("_order");
  CREATE INDEX "_lessons_v_version_links_parent_id_idx" ON "_lessons_v_version_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_lessons_v_version_links_locales_locale_parent_id_unique" ON "_lessons_v_version_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_lessons_v_version_links_locales_parent_id_idx" ON "_lessons_v_version_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_lessons_v_parent_idx" ON "_lessons_v" USING btree ("parent_id");
  CREATE INDEX "_lessons_v_version_version_course_idx" ON "_lessons_v" USING btree ("version_course_id");
  CREATE INDEX "_lessons_v_version_version_slug_idx" ON "_lessons_v" USING btree ("version_slug");
  CREATE INDEX "_lessons_v_version_version_cover_idx" ON "_lessons_v" USING btree ("version_cover_id");
  CREATE INDEX "_lessons_v_version_version_updated_at_idx" ON "_lessons_v" USING btree ("version_updated_at");
  CREATE INDEX "_lessons_v_version_version_created_at_idx" ON "_lessons_v" USING btree ("version_created_at");
  CREATE INDEX "_lessons_v_version_version__status_idx" ON "_lessons_v" USING btree ("version__status");
  CREATE INDEX "_lessons_v_created_at_idx" ON "_lessons_v" USING btree ("created_at");
  CREATE INDEX "_lessons_v_updated_at_idx" ON "_lessons_v" USING btree ("updated_at");
  CREATE INDEX "_lessons_v_snapshot_idx" ON "_lessons_v" USING btree ("snapshot");
  CREATE INDEX "_lessons_v_published_locale_idx" ON "_lessons_v" USING btree ("published_locale");
  CREATE INDEX "_lessons_v_latest_idx" ON "_lessons_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_lessons_v_locales_locale_parent_id_unique" ON "_lessons_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_lessons_v_locales_parent_id_idx" ON "_lessons_v_locales" USING btree ("_parent_id");
  CREATE INDEX "resources_file_idx" ON "resources" USING btree ("file_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE UNIQUE INDEX "resources_locales_locale_parent_id_unique" ON "resources_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "resources_locales_parent_id_idx" ON "resources_locales" USING btree ("_parent_id");
  CREATE INDEX "resources_rels_order_idx" ON "resources_rels" USING btree ("order");
  CREATE INDEX "resources_rels_parent_idx" ON "resources_rels" USING btree ("parent_id");
  CREATE INDEX "resources_rels_path_idx" ON "resources_rels" USING btree ("path");
  CREATE INDEX "resources_rels_courses_id_idx" ON "resources_rels" USING btree ("courses_id");
  CREATE INDEX "glossary_updated_at_idx" ON "glossary" USING btree ("updated_at");
  CREATE INDEX "glossary_created_at_idx" ON "glossary" USING btree ("created_at");
  CREATE UNIQUE INDEX "glossary_locales_locale_parent_id_unique" ON "glossary_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "glossary_locales_parent_id_idx" ON "glossary_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "access_codes_code_idx" ON "access_codes" USING btree ("code");
  CREATE INDEX "access_codes_updated_at_idx" ON "access_codes" USING btree ("updated_at");
  CREATE INDEX "access_codes_created_at_idx" ON "access_codes" USING btree ("created_at");
  CREATE INDEX "access_codes_rels_order_idx" ON "access_codes_rels" USING btree ("order");
  CREATE INDEX "access_codes_rels_parent_idx" ON "access_codes_rels" USING btree ("parent_id");
  CREATE INDEX "access_codes_rels_path_idx" ON "access_codes_rels" USING btree ("path");
  CREATE INDEX "access_codes_rels_courses_id_idx" ON "access_codes_rels" USING btree ("courses_id");
  CREATE INDEX "access_codes_rels_users_id_idx" ON "access_codes_rels" USING btree ("users_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_courses_id_idx" ON "users_rels" USING btree ("courses_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_levels_id_idx" ON "payload_locked_documents_rels" USING btree ("levels_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_lessons_id_idx" ON "payload_locked_documents_rels" USING btree ("lessons_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_glossary_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_id");
  CREATE INDEX "payload_locked_documents_rels_access_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("access_codes_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "assistant_charter_locales_locale_parent_id_unique" ON "assistant_charter_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "assistant_charter_locales_parent_id_idx" ON "assistant_charter_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "levels" CASCADE;
  DROP TABLE "levels_locales" CASCADE;
  DROP TABLE "courses_outcomes" CASCADE;
  DROP TABLE "courses_outcomes_locales" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "courses_locales" CASCADE;
  DROP TABLE "_courses_v_version_outcomes" CASCADE;
  DROP TABLE "_courses_v_version_outcomes_locales" CASCADE;
  DROP TABLE "_courses_v" CASCADE;
  DROP TABLE "_courses_v_locales" CASCADE;
  DROP TABLE "lessons_timecodes" CASCADE;
  DROP TABLE "lessons_timecodes_locales" CASCADE;
  DROP TABLE "lessons_questions" CASCADE;
  DROP TABLE "lessons_questions_locales" CASCADE;
  DROP TABLE "lessons_links" CASCADE;
  DROP TABLE "lessons_links_locales" CASCADE;
  DROP TABLE "lessons" CASCADE;
  DROP TABLE "lessons_locales" CASCADE;
  DROP TABLE "_lessons_v_version_timecodes" CASCADE;
  DROP TABLE "_lessons_v_version_timecodes_locales" CASCADE;
  DROP TABLE "_lessons_v_version_questions" CASCADE;
  DROP TABLE "_lessons_v_version_questions_locales" CASCADE;
  DROP TABLE "_lessons_v_version_links" CASCADE;
  DROP TABLE "_lessons_v_version_links_locales" CASCADE;
  DROP TABLE "_lessons_v" CASCADE;
  DROP TABLE "_lessons_v_locales" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_locales" CASCADE;
  DROP TABLE "resources_rels" CASCADE;
  DROP TABLE "glossary" CASCADE;
  DROP TABLE "glossary_locales" CASCADE;
  DROP TABLE "access_codes" CASCADE;
  DROP TABLE "access_codes_rels" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "assistant_charter" CASCADE;
  DROP TABLE "assistant_charter_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum__courses_v_version_status";
  DROP TYPE "public"."enum__courses_v_published_locale";
  DROP TYPE "public"."enum_lessons_kind";
  DROP TYPE "public"."enum_lessons_status";
  DROP TYPE "public"."enum__lessons_v_version_kind";
  DROP TYPE "public"."enum__lessons_v_version_status";
  DROP TYPE "public"."enum__lessons_v_published_locale";
  DROP TYPE "public"."enum_resources_kind";
  DROP TYPE "public"."enum_access_codes_scope";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_locale";`)
}
