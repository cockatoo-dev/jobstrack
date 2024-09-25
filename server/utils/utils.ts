import * as jose from 'jose'
import { JOSEError } from 'jose/errors'
import { getUserIdBeta } from '../db/db'

// export enum updateTypes {
//   NO_APPLICATION, 
//   APPLICATION_SENT, 
//   ONLINE_ASSESS, 
//   INTERVIEW,
//   PHONE_INTERVIEW,
//   VIRTUAL_INTERVIEW, 
//   TECH_INTERVIEW, 
//   BEHAVE_INTERVIEW,
//   FINAL_INTERVIEW,
//   ASSESS_CENTER,
//   RECEIVE_OFFER,
//   ACCEPT_OFFER,
//   DECLINE_OFFER,
//   REJECT,
//   WAITLIST
// }

export const updateTypes = {
  NO_APPLICATION: "No Application",
  APPLICATION_SENT: "Sent Application",
  ONLINE_ASSESS: "Online Assessment",
  INTERVIEW: "Interview",
  PHONE_INTERVIEW: "Phone Interview",
  VIRTUAL_INTERVIEW: "Virtual Interview",
  TECH_INTERVIEW: "Technical Interview",
  BEHAVE_INTERVIEW: "Behaviourla Interview",
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
  lastUpdateType: string,
  lastUpdateTime: number,
  isFuture: boolean,
  isRemind: boolean
}

export type updateItem = {
  updateId: string,
  updateType: string,
  updateTime: number
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

export const checkBetaToken = async (token: string | undefined) => {
  if (!token) {
    throw createError({
      status: 403,
      message: "No token provided. Please log in again."
    })
  }
  
  try {
    const { payload } = await jose.jwtVerify(token, jwtSecret, {algorithms: ["HS256"]})
    const authData = await getUserIdBeta(payload.jobsTrackUname as string)
    if (authData.exists) {
      if ((payload.iat || 0) > authData.passwordUpdateTime) {
        return authData.userId
      } else {
        throw createError({
          status: 403,
          message: "Invalid token. Please log out and log in again."
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

export const hashPassword = async (pass: string) => {
  const passBuffer = new TextEncoder().encode(pass)
  const passHash = await crypto.subtle.digest("SHA-256", passBuffer)
  return new TextDecoder().decode(passHash)
}

// export const processTime = async (time: number, uname: string) => {
//   const userSettings = await getUserSettingsBeta(uname)
//   if (userSettings.demoMode) {
//     return Date.now()
//   } else {
//     return time
//   }
// }
