import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { init } from "@paralleldrive/cuid2";

const createId = init({
  length: 8,
});

export const planEnum = pgEnum("plan", [
  "free",
  "lite",
  "pro",
  "business",
  "enterprise",
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

  plan: planEnum("plan").notNull().default("free"),
  stripeCustomerId: text("stripeCustomerId"),

  leadCount: integer("leadCount").notNull().default(0),

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

export const leads = pgTable("lead", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  endpointId: text("endpointId")
    .notNull()
    .references(() => endpoints.id, { onDelete: "cascade" }),
  data: jsonb("data").$type<{ [key: string]: any }>().notNull(),
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


export const fbcoaches = pgTable("fbcoaches", {
  id: integer("id")
      .$defaultFn(() => 1)  

    .notNull()
    .primaryKey(),
  school: text("school")
    .notNull(),
    photo_url: text("photo_url").notNull(),
  division: text("division").notNull(),
  head_coach: text("head_coach").notNull(),
  program_bio: text("program_bio").notNull(),
  email: text("email").notNull(),
    phone: text("phone").notNull(),
        website: text("website"),


  created_at: timestamp("created_at", { mode: "date" }).notNull(),
    updated_at: timestamp("updated_at", { mode: "date" }).notNull(),

});