CREATE TABLE IF NOT EXISTS "post_submitted_profiles" (
  "id" text PRIMARY KEY NOT NULL,
  "post_id" text NOT NULL,
  "user_id" text NOT NULL,
  "full_name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "sport" text,
  "position" text,
  "class_year" text,
  "height" text,
  "weight" text,
  "high_school" text,
  "city" text,
  "state" text,
  "gpa" text,
  "test_score" text,
  "video_url" text,
  "x_username" text,
  "instagram_username" text,
  "bio" text,
  "message" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "post_submitted_profiles"
 ADD CONSTRAINT "post_submitted_profiles_user_id_users_id_fk"
 FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "post_submitted_profiles_user_post_idx"
  ON "post_submitted_profiles" USING btree ("user_id","post_id");
