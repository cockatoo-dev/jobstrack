import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const usersInfo = sqliteTable("usersInfo", {
  userId: text("userId").primaryKey(),
  username: text("username").notNull(),
  remindDays: int("remindDays").notNull(),
  remindOfferDays: int("remindOfferDays").notNull(),
})

export const usersBeta = sqliteTable("usersBeta", {
  username: text("username").primaryKey(),
  passwordHash: text('passwordHash').notNull(),
  passwordUpdateTime: int("passwordUpdateTime").notNull(),
  userId: text("userId").references(() => usersInfo.userId).notNull()
})

export const jobs = sqliteTable("jobs", {
  jobId: text("jobId").primaryKey(),
  userId: text("userId").references(() => usersInfo.userId, {onDelete: 'cascade'}).notNull(),
  companyName: text("companyName").notNull(),
  jobTitle: text("jobTitle").notNull(),
  jobDescription: text("jobDescription").notNull(),
  lastUpdateType: text("lastUpdateType").notNull(),
  lastUpdateTime: int("lastUpdateTime").notNull(),
  dismissRemind: int("dismissRemind", {mode: 'boolean'}).notNull()

})

export const updates = sqliteTable("updates", {
  updateId: text("updateId").primaryKey(),
  jobId: text("jobId").references(() => jobs.jobId, {onDelete: 'cascade'}).notNull(),
  updateType: text("updateType").notNull(),
  updateTime: int("updateTime").notNull()
})
