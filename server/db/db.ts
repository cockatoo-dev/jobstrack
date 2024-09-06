import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { jobsLegacy, updatesLegacy, usersLegacy } from './schema'
import { and, asc, count, desc, eq } from 'drizzle-orm'

const sqlite = new Database(process.cwd() + '/localDB.db')
const db = drizzle(sqlite)

export const createUserLegacy = async (
  username: string, passwordHash: string
) => {
  const usernameMatch = await db.select({username: usersLegacy.username})
  .from(usersLegacy)
  .where(eq(usersLegacy.username, username))

  if (usernameMatch.length === 0) {
    db.insert(usersLegacy).values({
      username, 
      passwordHash, 
      remindDays: 14, 
      remindOfferDays: 3
    })
    return true
  } else return false
}

export const checkLoginLegacy = async (
  username: string, passwordHash: string
) => {
  const check = await db.select({username: usersLegacy.username})
  .from(usersLegacy)
  .where(and(
    eq(usersLegacy.username, username),
    eq(usersLegacy.passwordHash, passwordHash)
  ))

  return check.length === 1
}

export const getUserSettingsLegacy = async (username: string) => {
  return await db.select({
    remindDays: usersLegacy.remindDays,
    remindOfferDays: usersLegacy.remindOfferDays
  })
  .from(usersLegacy)
  .where(eq(usersLegacy.username, username))
}

export const editUserPasswordLEgacy = async (
  username: string, passwordHash: string
) => {
  db.update(usersLegacy).set({passwordHash})
  .where(eq(usersLegacy.username, username))
}

export const editUserSettingsLegacy = async (
  username: string, remindDays: number, remindOfferDays: number
) => {
  db.update(usersLegacy).set({remindDays, remindOfferDays})
  .where(eq(usersLegacy.username, username))
}

export const createJobLegacy = async (
  username: string,
  companyName: string,
  jobTitle: string,
  jobDescription: string,
  lastUpdateName: string,
  lastUpdateAction: string,
  lastUpdateTime: number,
  lastUpdateFlag: number
) => {
  db.insert(jobsLegacy).values({
    jobId: crypto.randomUUID(),
    user: username,
    companyName,
    jobTitle,
    jobDescription,
    lastUpdateName,
    lastUpdateAction,
    lastUpdateTime,
    lastUpdateFlag,
    dismissRemind: false
  })
}

export const getJobByIdLegacy = async (jobId: string, username: string) => {
  // Get a job and all associated updates
  return await db.select({
    companyName: jobsLegacy.companyName,
    jobTitle: jobsLegacy.jobTitle,
    jobDescription: jobsLegacy.jobDescription,
    dismissRemind: jobsLegacy.dismissRemind,
    updateId: updatesLegacy.updateId,
    updateName: updatesLegacy.name,
    updateAction: updatesLegacy.action,
    updatesTime: updatesLegacy.time,
    updatesFlag: updatesLegacy.flag
  })
  .from(jobsLegacy)
  .innerJoin(updatesLegacy, eq(updatesLegacy.job, jobsLegacy.jobId))
  .where(and(
    eq(jobsLegacy.jobId, jobId),
    eq(jobsLegacy.user, username)
  ))
  .orderBy(desc(updatesLegacy.time))
}

export const getJobsByUserLegacy = async (username: string) => {
  // Count the number of jobs that a user has
  const jobsCount = await db.select({num: count(jobsLegacy.jobId)})
  .from(jobsLegacy)
  .where(eq(jobsLegacy.user, username))

  // Get each job for the user and the latest update from each job
  return await db.select({
    jobId: jobsLegacy.jobId,
    companyName: jobsLegacy.companyName,
    jobTitle: jobsLegacy.jobTitle,
    action: updatesLegacy.action,
    time: updatesLegacy.time,
    flag: updatesLegacy.flag
  })
  .from(jobsLegacy)
  .innerJoin(updatesLegacy, eq(updatesLegacy.job, jobsLegacy.jobId))
  .where(eq(jobsLegacy.user, username))
  .orderBy(asc(jobsLegacy.companyName), desc(updatesLegacy.time))
  .limit(jobsCount[0].num)
}

export const editJob = async (
  jobId: string,
  username: string,
  companyName: string,
  jobTitle: string,
  jobDescription: string
) => {
  db.update(jobsLegacy).set({
    companyName,
    jobTitle,
    jobDescription
  })
  .where(and(
    eq(jobsLegacy.jobId, jobId),
    eq(jobsLegacy.user, username)
  ))
}

export const addUpdateLegacy = async (
  job: string,
  name: string,
  action: string,
  time: number,
  flag: number
) => {
  await db.insert(updatesLegacy).values({
    updateId: crypto.randomUUID(),
    job,
    name,
    action,
    time,
    flag
  })
}

export const setDismissRemindLegacy = async (
  username: string, 
  jobId: string, 
  dismissRemind: boolean) => {
  await db.update(jobsLegacy).set({dismissRemind}).where(and(
    eq(jobsLegacy.jobId, jobId),
    eq(jobsLegacy.user, username)
  ))
}

export const deleteUpdateLegacy = async (jobId: string, updateId: string) => {
  await db.delete(updatesLegacy).where(and(
    eq(updatesLegacy.job, jobId),
    eq(updatesLegacy.updateId, updateId)
  )).returning({del: updatesLegacy.updateId})
}

export const deleteJobLegacy = async (id: string, username: string) => {
  await db.delete(jobsLegacy).where(and(
    eq(jobsLegacy.jobId, id),
    eq(jobsLegacy.user, username)
  )).returning({del: jobsLegacy.jobId})
}

export const deleteUserLegacy = async (username: string, passwordHash: string) => {
  await db.delete(usersLegacy).where(and(
    eq(usersLegacy.username, username),
    eq(usersLegacy.passwordHash, passwordHash)
  )).returning({del: usersLegacy.username})
}
