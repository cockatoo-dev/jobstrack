import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { jobs, updates, usersBeta, usersInfo } from './schema'
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
    const userId = crypto.randomUUID()
    await db.insert(usersInfo).values({
      userId,
      username,
      remindDays: 14,
      remindOfferDays: 3
    })
    await db.insert(usersBeta).values({
      username, 
      passwordHash,
      passwordUpdateTime: Math.floor(Date.now() / 1000),
      userId
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

export const getUserIdBeta = async (username: string) => {
  const data = await db.select({
    userId: usersBeta.userId,
    passwordUpdateTime: usersBeta.passwordUpdateTime
  })
  .from(usersBeta)
  .where(eq(usersBeta.username, username))

  if (data.length === 1) {
    return {
      exists: true,
      userId: data[0].userId,
      passwordUpdateTime: data[0].passwordUpdateTime
    }
  } else {
    return {
      exists: false,
      userId: "",
      passwordUpdateTime: NaN
    }
  }
}

export const getUserSettingsBeta = async (userId: string) => {
  const data = await db.select({
    remindDays: usersInfo.remindDays,
    remindOfferDays: usersInfo.remindOfferDays
  })
  .from(usersInfo)
  .where(eq(usersInfo.userId, userId))
  
  return data[0]
}

export const editUserPasswordBeta = async (
  username: string, passwordHash: string
) => {
  await db.update(usersBeta).set({passwordHash})
  .where(eq(usersBeta.username, username))
}

export const editUserSettings = async (
  userId: string,
  remindDays: number, 
  remindOfferDays: number
) => {
  await db.update(usersInfo).set({remindDays, remindOfferDays})
  .where(eq(usersInfo.userId, userId))
}

export const createJob = async (
  userId: string,
  companyName: string,
  jobTitle: string,
  jobDescription: string,
  lastUpdateType: string,
  lastUpdateTime: number
) => {
  const jobId = crypto.randomUUID()
  await db.insert(jobs).values({
    jobId,
    userId,
    companyName,
    jobTitle,
    jobDescription,
    lastUpdateType,
    lastUpdateTime,
    dismissRemind: false
  })
  return jobId
}

export const getJobById = async (jobId: string, userId: string) => {
  return await db.select({
    companyName: jobs.companyName,
    jobTitle: jobs.jobTitle,
    jobDescription: jobs.jobDescription,
    dismissRemind: jobs.dismissRemind,
    updateId: updates.updateId,
    updateType: updates.updateType,
    updateTime: updates.updateTime
  })
  .from(jobs)
  .innerJoin(updates, eq(updates.jobId, jobs.jobId))
  .where(and(
    eq(jobs.jobId, jobId),
    eq(jobs.userId, userId)
  ))
  .orderBy(desc(updates.updateTime))
}

export const getJobsByUser = async (userId: string) => {
  return await db.select({
    jobId: jobs.jobId,
    companyName: jobs.companyName,
    jobTitle: jobs.jobTitle,
    dismissRemind: jobs.dismissRemind,
    lastUpdateType: jobs.lastUpdateType,
    lastUpdateTime: jobs.lastUpdateTime
  })
  .from(jobs)
  .where(eq(jobs.userId, userId))
  .orderBy(asc(jobs.companyName))
}

export const editJob = async (
  jobId: string,
  userId: string,
  companyName: string,
  jobTitle: string,
  jobDescription: string
) => {
  await db.update(jobs).set({
    companyName,
    jobTitle,
    jobDescription
  })
  .where(and(
    eq(jobs.jobId, jobId),
    eq(jobs.userId, userId)
  ))
}

export const setJobReminder = async (
  jobId: string, 
  userId: string,
  dismissRemind: boolean
) => {
  await db.update(jobs).set({
   dismissRemind
  })
  .where(and(
    eq(jobs.jobId, jobId),
    eq(jobs.userId, userId)
  ))
}

export const addUpdate = async (
  jobId: string,
  updateType: string,
  updateTime: number
) => {
  const updateId = crypto.randomUUID()
  await db.insert(updates).values({
    updateId,
    jobId,
    updateType,
    updateTime
  })
  return updateId
}

export const deleteUpdateBeta = async (jobId: string, updateId: string) => {
  await db.delete(updates).where(and(
    eq(updates.jobId, jobId),
    eq(updates.updateId, updateId)
  )).returning({del: updates.updateId})
}

export const deleteJobBeta = async (id: string, userId: string) => {
  await db.delete(jobs).where(and(
    eq(jobs.jobId, id),
    eq(jobs.userId, userId)
  )).returning({del: jobs.jobId})
}

export const deleteUserBeta = async (username: string, passwordHash: string) => {
  const deleted = await db.delete(usersBeta).where(and(
    eq(usersBeta.username, username),
    eq(usersBeta.passwordHash, passwordHash)
  )).returning({userId: usersBeta.userId})

  if (deleted.length === 1) {
    await db.delete(usersInfo).where(
      eq(usersInfo.userId, deleted[0].userId)
    )
  }
}
