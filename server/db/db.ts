import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { jobsBeta, updatesBeta, usersBeta } from './schema'
import { and, asc, desc, eq } from 'drizzle-orm'

const sqlite = new Database(process.cwd() + '/localDB.db')
const db = drizzle(sqlite)

export const createUserBeta = async (
  username: string, passwordHash: string
) => {
  const usernameMatch = await db.select({username: usersBeta.username})
  .from(usersBeta)
  .where(eq(usersBeta.username, username))

  if (usernameMatch.length === 0) {
    db.insert(usersBeta).values({
      username, 
      passwordHash, 
      remindDays: 14, 
      remindOfferDays: 3
    })
    return true
  } else return false
}

export const checkLoginBeta = async (
  username: string, passwordHash: string
) => {
  const check = await db.select({username: usersBeta.username})
  .from(usersBeta)
  .where(and(
    eq(usersBeta.username, username),
    eq(usersBeta.passwordHash, passwordHash)
  ))

  return check.length === 1
}

export const changePasswordBeta = async (
  username: string, 
  oldPasswordHash: string, 
  newPasswordHash: string
) => {
  if (!(await checkLoginBeta(username, oldPasswordHash))) {
    return false
  }
  await db.update(usersBeta).set({passwordHash: newPasswordHash})
  .where(eq(usersBeta.username, username))
}

export const getUserSettingsBeta = async (username: string) => {
  return await db.select({
    remindDays: usersBeta.remindDays,
    remindOfferDays: usersBeta.remindOfferDays
  })
  .from(usersBeta)
  .where(eq(usersBeta.username, username))
}

export const editUserPasswordBeta = async (
  username: string, passwordHash: string
) => {
  db.update(usersBeta).set({passwordHash})
  .where(eq(usersBeta.username, username))
}

export const editUserSettingsBeta = async (
  username: string, remindDays: number, remindOfferDays: number
) => {
  db.update(usersBeta).set({remindDays, remindOfferDays})
  .where(eq(usersBeta.username, username))
}

export const createJobBeta = async (
  username: string,
  companyName: string,
  jobTitle: string,
  jobDescription: string,
  lastUpdateType: updateTypes,
  lastUpdateTime: number
) => {
  db.insert(jobsBeta).values({
    jobId: crypto.randomUUID(),
    user: username,
    companyName,
    jobTitle,
    jobDescription,
    lastUpdateType,
    lastUpdateTime,
    dismissRemind: false
  })
}

export const getJobByIdBeta = async (jobId: string, username: string) => {
  // Get a job and all associated updates
  return await db.select({
    companyName: jobsBeta.companyName,
    jobTitle: jobsBeta.jobTitle,
    jobDescription: jobsBeta.jobDescription,
    dismissRemind: jobsBeta.dismissRemind,
    updateId: updatesBeta.updateId,
    updateType: updatesBeta.updateType,
    updateTime: updatesBeta.updateTime
  })
  .from(jobsBeta)
  .innerJoin(updatesBeta, eq(updatesBeta.job, jobsBeta.jobId))
  .where(and(
    eq(jobsBeta.jobId, jobId),
    eq(jobsBeta.user, username)
  ))
  .orderBy(desc(updatesBeta.updateTime))
}

export const getJobsByUserBeta = async (username: string) => {
  return await db.select({
    jobId: jobsBeta.jobId,
    companyName: jobsBeta.companyName,
    jobTitle: jobsBeta.jobTitle,
    lastUpdateType: jobsBeta.lastUpdateType,
    lastUpdateTime: jobsBeta.lastUpdateTime
  })
  .from(jobsBeta)
  .where(eq(jobsBeta.user, username))
  .orderBy(asc(jobsBeta.companyName))
}

export const editJob = async (
  jobId: string,
  username: string,
  companyName: string,
  jobTitle: string,
  jobDescription: string
) => {
  db.update(jobsBeta).set({
    companyName,
    jobTitle,
    jobDescription
  })
  .where(and(
    eq(jobsBeta.jobId, jobId),
    eq(jobsBeta.user, username)
  ))
}

export const addUpdateBeta = async (
  job: string,
  updateType: updateTypes,
  updateTime: number
) => {
  await db.insert(updatesBeta).values({
    updateId: crypto.randomUUID(),
    job,
    updateType,
    updateTime
  })
}

export const setDismissRemindBeta = async (
  username: string, 
  jobId: string, 
  dismissRemind: boolean) => {
  await db.update(jobsBeta).set({dismissRemind}).where(and(
    eq(jobsBeta.jobId, jobId),
    eq(jobsBeta.user, username)
  ))
}

export const deleteUpdateBeta = async (jobId: string, updateId: string) => {
  await db.delete(updatesBeta).where(and(
    eq(updatesBeta.job, jobId),
    eq(updatesBeta.updateId, updateId)
  )).returning({del: updatesBeta.updateId})
}

export const deleteJobBeta = async (id: string, username: string) => {
  await db.delete(jobsBeta).where(and(
    eq(jobsBeta.jobId, id),
    eq(jobsBeta.user, username)
  )).returning({del: jobsBeta.jobId})
}

export const deleteUserBeta = async (username: string, passwordHash: string) => {
  await db.delete(usersBeta).where(and(
    eq(usersBeta.username, username),
    eq(usersBeta.passwordHash, passwordHash)
  )).returning({del: usersBeta.username})
}
