import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  boolean,
  jsonb,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { init } from "@paralleldrive/cuid2";

const createId = init({
  length: 8,
});

export const planEnum = pgEnum("plan", [
  "free",
  "rookie",
  "mvp",
  "elite",
]);


export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),

  name: text("name"),
  last_name: text("last_name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  hashedPassword: text("hashedPassword").notNull(),

  grad_year: text("grad_year"),
  bio: text("bio"),
  test_score: text("test_score"),
  height: text("height"),
  weight: text("weight"),

  position: text("position"),
  sport: text("sport"),
  video: text("video"),
  high_school: text("high_school"),
  city: text("city"),
  state: text("state"),
  x_username: text("x_username"),
  ig_username: text("ig_username"),
    gpa: text("GPA"),

  coachNote: text("coachNote"),
    expo_score: text("expo_score"),
ACD_score: text("ACD_score"),
ATH_score: text("ATH_score"),

  plan: planEnum("plan").notNull().default("free"),
  stripeCustomerId: text("stripeCustomerId"),

  leadCount: integer("leadCount").notNull().default(0),
  campaigncount: integer("campaigncount").notNull().default(1),
  boostcount: integer("boostcount").notNull().default(1),

  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const userss = pgTable("users", {
id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
      email: text("email").notNull().unique(),
  name: text("name"),
  hashedPassword: text("hashedPassword").notNull(),
});


export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const endpoints = pgTable("endpoint", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  schema: jsonb("schema")
    .$type<{ key: string; value: ValidationType }[]>()
    .notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  webhookEnabled: boolean("webhookEnabled").default(false).notNull(),
  emailNotify: boolean("emailNotify").default(false).notNull(),
  webhook: text("webhook"),
  formEnabled: boolean("formEnabled").default(false).notNull(),
  successUrl: text("successUrl"),
  failUrl: text("failUrl"),
  token: text("token"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});


export const boosts = pgTable("boosts", {
  id: text("id")
    .$defaultFn(() => createId()) // Automatically generate a unique boost ID
    .notNull()
    .primaryKey(), // The boost ID will be the primary key

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // References the user who created the boost

  xUsername: text("x_username").notNull(), // X Username (formerly Twitter) for the boost
  boostTypes: text("boost_type").notNull(),
  boostLink: text("boost_link").notNull(), // The link to the content being boosted (e.g., a custom post or repost)

  createdAt: timestamp("created_at", { mode: "date" }).notNull(), // Timestamp when the boost was created
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(), // Timestamp when the boost was last updated
});

export const campaigns = pgTable("campaigns", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  status: text("status").default("started").notNull(),

  segments: jsonb("segments")
    .$type<Array<"fbs" | "fcs" | "d2" | "d3" | "my">>()
    .notNull(),

  types: jsonb("types").$type<string[]>().default([]).notNull(),
  material: text("material").notNull(), // 'profile' or 'custom'

  bio: text("bio").notNull(),
  filmLink: text("film_link").notNull(),
  classYear: text("class_year").notNull(),
  height: text("height").notNull(),
  weight: text("weight").notNull(),

  token: text("token"),
  emailNotify: boolean("email_notify").default(false).notNull(),
  boostEnabled: boolean("boost_enabled").default(false).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});


export const leads = pgTable("lead", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const logTypeEnum = pgEnum("logType", ["success", "error"]);
export const logPostTypeEnum = pgEnum("logPostType", [
  "http",
  "form",
  "webhook",
  "email",
]);

export const logs = pgTable("log", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  endpointId: text("endpointId")
    .notNull()
    .references(() => endpoints.id, { onDelete: "cascade" }),
  type: logTypeEnum("type").notNull(),
  postType: logPostTypeEnum("postType").notNull(),
  message: jsonb("message").$type<Record<string, any> | unknown>().notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
});


export const programs = pgTable("programs", {
  id: integer("id")
    .$defaultFn(() => 1)  
    .notNull()
    .primaryKey(),
  school: text("school")
    .notNull(),
  image: text("image")
    .notNull(),
  location: text("location")  // Added location field
    .notNull(),
  division: text("division")
    .notNull(),
  conference: text("conference")  // Added conference field
    .notNull(),
  head_coach: text("head_coach")
    .notNull(),
  bio: text("bio")
    .notNull(),
  email: text("email")
    .notNull(),
  phone: text("phone")
    .notNull(),
  full_staff: text("full_staff")  // Added full_staff field
    .notNull(),
  website: text("website").notNull()
,  // This can remain nullable
  gpa: text("gpa")  // Added GPA field
    .notNull(),
  act_sat: text("act_sat")  // Added ACT field
    .notNull(),
  camps: text("camps")  // Added camps field
    .notNull(),
  expo_score: text("expo_score")  // Added expo_score field
    .notNull(),
});


export const bbprograms = pgTable("basketball_programs", {
    id: integer("id")
    .$defaultFn(() => 1)  
    .notNull()
    .primaryKey(),

  image: text("image"),
  school: varchar("school", { length: 255 }),
  location: varchar("location", { length: 255 }),
  division: varchar("division", { length: 50 }),
  conference: varchar("conference", { length: 100 }),
  gpa: numeric("gpa", { precision: 3, scale: 2 }),
  act_sat: varchar("act_sat", { length: 50 }),

  m_coach: varchar("m_coach", { length: 255 }),
  m_email: varchar("m_email", { length: 255 }),
  m_phone: varchar("m_phone", { length: 50 }),
  m_bio: text("m_bio"),
  m_twitter: varchar("m_twitter", { length: 100 }),
  m_full_staff: text("m_full_staff"),
  m_website: varchar("m_website", { length: 255 }),
  m_camp: text("m_camp"),

  w_coach: varchar("w_coach", { length: 255 }),
  w_bio: text("w_bio"),
  w_email: varchar("w_email", { length: 255 }),
  w_twitter: varchar("w_twitter", { length: 100 }),
  w_phone: varchar("w_phone", { length: 50 }),
  w_full_staff: text("w_full_staff"),
  w_website: varchar("w_website", { length: 255 }),
  w_camps: text("w_camps"),
});