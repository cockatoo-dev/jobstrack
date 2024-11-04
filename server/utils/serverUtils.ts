import * as jose from 'jose'
import { JOSEError } from 'jose/errors'
import type { db } from '../db/db'
import { sha256base64 } from 'ohash'

export const DAY = 86400000
export const limits = {
  JOB_LIMIT: 50,
  UPDATE_LIMIT: 10
}

export const updateTypes = {
  NO_APPLICATION: "",
  APPLICATION_SENT: "Sent Application",
  ONLINE_ASSESS: "Online Assessment",
  TAKE_HOME: "Take Home Task",
  INTERVIEW: "Interview",
  PHONE_INTERVIEW: "Phone Interview",
  VIRTUAL_INTERVIEW: "Virtual Interview",
  TECH_INTERVIEW: "Technical Interview",
  BEHAVE_INTERVIEW: "Behavioural Interview",
  FINAL_INTERVIEW: "Final Interview",
  ASSESS_CENTER: "Assessment Center",
  RECEIVE_OFFER: "Received Offer",
  ACCEPT_OFFER: "Accepted Offer",
  DECLINE_OFFER: "Declined Offer",
  REJECT: "Rejected",
  WAITLIST: "Placed on Waitlist"
}

export type dashboardJobItem = {
  jobId: string,
  companyName: string,
  jobTitle: string,
  updateType: string,
  updateTime: number,
  futureCount: number,
  hasAcceptOffer: boolean,
  isFuture: boolean,
  isRemind: boolean
}

export type updateItem = {
  updateId: string,
  updateType: string,
  updateTime: number,
  updateNotes: string
}

export const TOKEN_COOKIE = "JobsTrackAuth"
export const TOKEN_EXPIRY = 604700

const jwtSecret = new TextEncoder().encode(process.env.JOBSTRACK_JWT)

export const createBetaToken = async (uname: string) => {
  return await new jose.SignJWT({jobsTrackUname: uname})
  .setProtectedHeader({alg: "HS256"})
  .setIssuedAt()
  .setExpirationTime("14d")
  .sign(jwtSecret)
}

export const checkBetaToken = async (db: db, token: string | undefined) => {
  if (!token) {
    throw createError({
      status: 403,
      message: "No token provided. Please log in again."
    })
  }
  
  try {
    const { payload } = await jose.jwtVerify(token, jwtSecret, {algorithms: ["HS256"]})
    const authData = await db.getUserIdBeta(payload.jobsTrackUname as string)
    if (authData.exists) {
      if ((payload.iat || 0) >= authData.passwordUpdateTime) {
        return authData.userId
      } else {
        throw createError({
          status: 403,
          message: "Expired token. Please log in again."
        })
      }
    } else {
      throw createError({
        status: 403,
        message: "Invalid token. Please log out and log in again."
      })
    }
  } catch (e) {
    if (e instanceof JOSEError) {
      throw createError({
        status: 401,
        message: "Invalid token. Please log out and log in again."
      })
    } else {
      throw e
    }
  }
}

export const checkBetaTokenUname = async (db: db, token: string | undefined) => {
  if (!token) {
    throw createError({
      status: 403,
      message: "No token provided. Please log in again."
    })
  }
  
  try {
    const { payload } = await jose.jwtVerify(token, jwtSecret, {algorithms: ["HS256"]})
    const authData = await db.getUserIdBeta(payload.jobsTrackUname as string)
    if (authData.exists) {
      if ((payload.iat || 0) >= authData.passwordUpdateTime) {
        return payload.jobsTrackUname as string
      } else {
        throw createError({
          status: 403,
          message: "Expired token. Please log in again."
        })
      }
    } else {
      throw createError({
        status: 403,
        message: "Invalid token. Please log out and log in again."
      })
    }
  } catch (e) {
    if (e instanceof JOSEError) {
      throw createError({
        status: 401,
        message: "Invalid token. Please log out and log in again."
      })
    } else {
      throw e
    }
  }
}

export const hashPassword = async (password: string) => {
  return sha256base64(password)
}

export const daysApart = (time: number) => {
  return (Date.now() - time) / DAY
}

export const checkTime = (clientTimestamp: number) => {
  const serverTimestamp = Date.now()
  if (serverTimestamp - clientTimestamp > DAY) {
    return false
  } else if (clientTimestamp - serverTimestamp > DAY) {
    return false
  } else {
    return true
  }
}

export const getCheckedTime = (clientTimestamp: number) => {
  const serverTimestamp = Date.now()
  if (serverTimestamp - clientTimestamp > DAY) {
    return serverTimestamp
  } else if (clientTimestamp - serverTimestamp > DAY) {
    return serverTimestamp
  } else {
    return clientTimestamp
  }
}

export const dayTimestamp = () => {
  return new Date(new Date().toDateString()).getTime()
}

export const checkDay = (clientTimestamp: number) => {
  const serverTimestamp = dayTimestamp()
  if (serverTimestamp - clientTimestamp > DAY) {
    return false
  } else if (clientTimestamp - serverTimestamp > DAY) {
    return false
  } else {
    return true
  }
}

export const getCheckedDay = (clientTimestamp: number) => {
  const serverTimestamp = dayTimestamp()
  if (serverTimestamp - clientTimestamp > DAY) {
    return serverTimestamp
  } else if (clientTimestamp - serverTimestamp > DAY) {
    return serverTimestamp
  } else {
    return clientTimestamp
  }
}


export const checkRemind = (
  updateType: string,
  updateTime: number,
  remindDays: number,
  remindOfferDays: number
) => {  
  if (updateType === updateTypes.NO_APPLICATION) {
    return true
  } else if (
    updateType === updateTypes.ACCEPT_OFFER ||
    updateType === updateTypes.DECLINE_OFFER ||
    updateType === updateTypes.REJECT ||
    updateType === updateTypes.WAITLIST
  ) {
    return false
  } else if (
    updateType === updateTypes.RECEIVE_OFFER && 
    daysApart(updateTime) >= remindOfferDays 
  ) {
    return true
  } else if (daysApart(updateTime) >= remindDays) {
    return true
  } else {
    return false
  }
}

// export const processTime = async (time: number, uname: string) => {
//   const userSettings = await getUserSettingsBeta(uname)
//   if (userSettings.demoMode) {
//     return Date.now()
//   } else {
//     return time
//   }
// }
