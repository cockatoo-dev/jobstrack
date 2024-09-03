import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const usersLegacy = sqliteTable("usersLegacy", {
  username: text("username").primaryKey(),
  passwordHash: text('passwordHash').notNull(),
  remindDays: int("remindDays").notNull(),
  remindOfferDays: int("remindOfferDays").notNull()
})

export const jobsLegacy = sqliteTable("jobsLegacy", {
  id: text("id").primaryKey(),
  user: text("user").references(() => usersLegacy.username, {onDelete: 'cascade'}).notNull(),
  companyName: text("companyName").notNull(),
  jobTitle: text("jobTitle").notNull(),
  jobDescription: text("jobDescriptions").notNull()
})

export const updatesLegacy = sqliteTable("updatesLegacy", {
  id: text("id").primaryKey(),
  job: text("job").references(() => jobsLegacy.id, {onDelete: 'cascade'}).notNull(),
  name: text("name").notNull(),
  action: text("action").notNull(),
  time: int("time").notNull(),
  flag: int("flag").notNull()
})
