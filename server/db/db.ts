import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import { jobs, updates, usersBeta, usersInfo } from './schema'
import { and, desc, eq } from 'drizzle-orm'

const sqlite = new Database(process.cwd() + '/localDB.db')
const db = drizzle(sqlite, {schema})

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
      remindFuture: true,
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
  newPasswordHash: string
) => {
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

export const getUserInfo = async (userId: string) => {
  const data = await db.select({
    username: usersInfo.username,
    remindFuture: usersInfo.remindFuture,
    remindDays: usersInfo.remindDays,
    remindOfferDays: usersInfo.remindOfferDays
  })
  .from(usersInfo)
  .where(eq(usersInfo.userId, userId))
  
  return data[0]
}

export const editUserSettings = async (
  userId: string,
  remindDays: number, 
  remindOfferDays: number,
  remindFuture: boolean
) => {
  await db.update(usersInfo).set({remindDays, remindOfferDays, remindFuture})
  .where(eq(usersInfo.userId, userId))
}

export const createJob = async (
  userId: string,
  companyName: string,
  jobTitle: string,
  jobDescription: string
) => {
  const jobId = crypto.randomUUID()
  await db.insert(jobs).values({
    jobId,
    userId,
    companyName,
    jobTitle,
    jobDescription,
    dismissRemind: false
  })
  return jobId
}

export const getJobData = async (jobId: string, userId: string) => {
  return await db.query.jobs.findFirst({
    where: and(
      eq(jobs.jobId, jobId),
      eq(jobs.userId, userId)
    ),
    with: {
      updates: {
        orderBy: desc(updates.updateTime)
      }
    }
  })
}

export const checkJobOwner = async (jobId: string, userId: string) => {
  const result = await db.select({jobId: jobs.jobId})
  .from(jobs)
  .where(and(
    eq(jobs.jobId, jobId),
    eq(jobs.userId, userId)
  ))

  return result.length === 1
}

export const getUserJobs = async (userId: string) => {
  return await db.select({
    jobId: jobs.jobId,
    companyName: jobs.companyName,
    jobTitle: jobs.jobTitle
  })
  .from(jobs)
  .where(eq(jobs.userId, userId))
}

export const getJobUpdates = async (jobId: string) => {
  return await db.select({
    updateId: updates.updateId,
    updateType: updates.updateType,
    updateTime: updates.updateTime,
    updateDay: updates.updateDay
  })
  .from(updates)
  .where(eq(updates.jobId, jobId))
  .orderBy(updates.updateTime)
}

export const getDashboardJobs = async (userId: string) => {
  return await db.query.jobs.findMany({
    columns: {
      jobId: true,
      companyName: true,
      jobTitle: true,
      dismissRemind: true,
    },
    where: eq(jobs.userId, userId),
    with: {
      updates: {
        columns: {
          updateType: true,
          updateTime: true,
          updateDay: true
        },
        orderBy: desc(updates.updateTime)
      }
    }
  })
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

// export const setJobLastUpdate = async (
//   jobId: string,
//   userId: string,
//   lastUpdateType: string,
//   lastUpdateTime: number,
//   lastUpdateDay: number
// ) => {
//   await db.update(jobs).set({
//     lastUpdateTime,
//     lastUpdateType,
//     lastUpdateDay
//   })
//   .where(and(
//     eq(jobs.jobId, jobId),
//     eq(jobs.userId, userId)
//   ))
// }

export const addUpdate = async (
  jobId: string,
  updateType: string,
  updateTime: number,
  updateDay: number,
  updateNotes: string
) => {
  const updateId = crypto.randomUUID()
  await db.insert(updates).values({
    updateId,
    jobId,
    updateType,
    updateTime,
    updateDay,
    updateNotes
  })
  return updateId
}

export const deleteUpdate = async (jobId: string, updateId: string) => {
  return await db.delete(updates).where(and(
    eq(updates.jobId, jobId),
    eq(updates.updateId, updateId)
  )).returning({del: updates.updateId})
}

export const deleteJob = async (jobId: string, userId: string) => {
  return await db.delete(jobs).where(and(
    eq(jobs.jobId, jobId),
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
