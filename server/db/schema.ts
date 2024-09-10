import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const usersBeta = sqliteTable("usersBeta", {
  username: text("username").primaryKey(),
  passwordHash: text('passwordHash').notNull(),
  remindDays: int("remindDays").notNull(),
  remindOfferDays: int("remindOfferDays").notNull(),
  demoMode: int("demoMode", {mode: "boolean"}).notNull()
})

export const jobsBeta = sqliteTable("jobsBeta", {
  jobId: text("id").primaryKey(),
  user: text("user").references(() => usersBeta.username, {onDelete: 'cascade'}).notNull(),
  companyName: text("companyName").notNull(),
  jobTitle: text("jobTitle").notNull(),
  jobDescription: text("jobDescription").notNull(),
  lastUpdateType: int("lastUpdateType").notNull(),
  lastUpdateTime: int("lastUpdateTime").notNull(),
  dismissRemind: int("dismissRemind", {mode: 'boolean'}).notNull()

})

export const updatesBeta = sqliteTable("updatesBeta", {
  updateId: text("id").primaryKey(),
  job: text("job").references(() => jobsBeta.jobId, {onDelete: 'cascade'}).notNull(),
  updateType: int("updateType").notNull(),
  updateTime: int("updateTime").notNull()
})
