import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from './schema'
import { jobs, updates, usersBeta, usersInfo } from './schema'
import { and, desc, eq } from 'drizzle-orm'
import type { EventHandlerRequest, H3Event } from "h3"
// import Database from 'better-sqlite3'

export class db {
  private _db: DrizzleD1Database<typeof schema>

  constructor (e: H3Event) {
    const d1 = e.context.cloudflare.env.CF_DB as unknown as D1Database
    this._db = drizzle(d1, {schema})
    // const sqlite = new Database(process.cwd() + "/localdb.db")
    // this._db = drizzle(sqlite, {schema})
  }

  public createUserBeta = async (
    username: string, passwordHash: string
  ) => {
    const usernameMatch = await this._db.select({username: usersBeta.username})
    .from(usersBeta)
    .where(eq(usersBeta.username, username))

    if (usernameMatch.length === 0) {
      const userId = crypto.randomUUID()
      await this._db.insert(usersInfo).values({
        userId,
        username,
        remindFuture: true,
        remindDays: 14,
        remindOfferDays: 3
      })
      await this._db.insert(usersBeta).values({
        username, 
        passwordHash,
        passwordUpdateTime: Math.floor(Date.now() / 1000),
        userId
      })
      return true
    } else return false
  }

  public checkLoginBeta = async (
    username: string, passwordHash: string
  ) => {
    const check = await this._db.select({username: usersBeta.username})
    .from(usersBeta)
    .where(and(
      eq(usersBeta.username, username),
      eq(usersBeta.passwordHash, passwordHash)
    ))

    return check.length === 1
  }

  public changePasswordBeta = async (
    username: string, 
    newPasswordHash: string
  ) => {
    await this._db.update(usersBeta).set({passwordHash: newPasswordHash})
    .where(eq(usersBeta.username, username))
  }

  public getUserIdBeta = async (username: string) => {
    const data = await this._db.select({
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

  public getUserInfo = async (userId: string) => {
    const data = await this._db.select({
      username: usersInfo.username,
      remindFuture: usersInfo.remindFuture,
      remindDays: usersInfo.remindDays,
      remindOfferDays: usersInfo.remindOfferDays
    })
    .from(usersInfo)
    .where(eq(usersInfo.userId, userId))
    
    return data[0]
  }

  public editUserSettings = async (
    userId: string,
    remindDays: number, 
    remindOfferDays: number,
    remindFuture: boolean
  ) => {
    await this._db.update(usersInfo).set({remindDays, remindOfferDays, remindFuture})
    .where(eq(usersInfo.userId, userId))
  }

  public createJob = async (
    userId: string,
    companyName: string,
    jobTitle: string,
    jobDescription: string
  ) => {
    const jobId = crypto.randomUUID()
    await this._db.insert(jobs).values({
      jobId,
      userId,
      companyName,
      jobTitle,
      jobDescription,
      dismissRemind: false
    })
    return jobId
  }

  public getJobData = async (jobId: string, userId: string) => {
    return await this._db.query.jobs.findFirst({
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

  public checkJobOwner = async (jobId: string, userId: string) => {
    const result = await this._db.select({jobId: jobs.jobId})
    .from(jobs)
    .where(and(
      eq(jobs.jobId, jobId),
      eq(jobs.userId, userId)
    ))

    return result.length === 1
  }

  public getUserJobs = async (userId: string) => {
    return await this._db.select({
      jobId: jobs.jobId,
      companyName: jobs.companyName,
      jobTitle: jobs.jobTitle
    })
    .from(jobs)
    .where(eq(jobs.userId, userId))
  }

  public getJobUpdates = async (jobId: string) => {
    return await this._db.select({
      updateId: updates.updateId,
      updateType: updates.updateType,
      updateTime: updates.updateTime,
      updateDay: updates.updateDay
    })
    .from(updates)
    .where(eq(updates.jobId, jobId))
    .orderBy(updates.updateTime)
  }

  public getDashboardJobs = async (userId: string) => {
    return await this._db.query.jobs.findMany({
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

  public editJob = async (
    jobId: string,
    userId: string,
    companyName: string,
    jobTitle: string,
    jobDescription: string
  ) => {
    await this._db.update(jobs).set({
      companyName,
      jobTitle,
      jobDescription
    })
    .where(and(
      eq(jobs.jobId, jobId),
      eq(jobs.userId, userId)
    ))
  }

  public setJobReminder = async (
    jobId: string, 
    userId: string,
    dismissRemind: boolean
  ) => {
    await this._db.update(jobs).set({
    dismissRemind
    })
    .where(and(
      eq(jobs.jobId, jobId),
      eq(jobs.userId, userId)
    ))
  }

  public addUpdate = async (
    jobId: string,
    updateType: string,
    updateTime: number,
    updateDay: number,
    updateNotes: string
  ) => {
    const updateId = crypto.randomUUID()
    await this._db.insert(updates).values({
      updateId,
      jobId,
      updateType,
      updateTime,
      updateDay,
      updateNotes
    })
    return updateId
  }

  public deleteUpdate = async (jobId: string, updateId: string) => {
    return await this._db.delete(updates).where(and(
      eq(updates.jobId, jobId),
      eq(updates.updateId, updateId)
    )).returning({del: updates.updateId})
  }

  public deleteJob = async (jobId: string, userId: string) => {
    return await this._db.delete(jobs).where(and(
      eq(jobs.jobId, jobId),
      eq(jobs.userId, userId)
    )).returning({del: jobs.jobId})
  }

  public deleteUserBeta = async (username: string, passwordHash: string) => {
    const deleted = await this._db.delete(usersBeta).where(and(
      eq(usersBeta.username, username),
      eq(usersBeta.passwordHash, passwordHash)
    )).returning({userId: usersBeta.userId})

    if (deleted.length === 1) {
      await this._db.delete(usersInfo).where(
        eq(usersInfo.userId, deleted[0].userId)
      )
    }
  }
}

let dbInstance: db | undefined

export const useDB = (e: H3Event<EventHandlerRequest>) => {
  if (dbInstance) {
    return dbInstance
  } else {
    return new db(e)
  }
}
