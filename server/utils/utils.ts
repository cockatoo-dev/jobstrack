import * as jose from 'jose'
import { JOSEError } from 'jose/errors'

export enum updateTypes {
  NO_APPLICATION, 
  APPLICATION_SENT, 
  ONLINE_ASSESS, 
  INTERVIEW,
  PHONE_INTERVIEW,
  VIRTUAL_INTERVIEW, 
  TECH_INTERVIEW, 
  BEHAVE_INTERVIEW,
  FINAL_INTERVIEW,
  ASSESS_CENTER,
  RECEIVE_OFFER,
  ACCEPT_OFFER,
  DECLINE_OFFER,
  REJECT,
  WAITLIST
}

export const TOKEN_COOKIE = "jobsTrackToken"

const jwtSecret = new TextEncoder().encode(process.env.JOBSTRACK_JWT)

export const createToken = async (uname: string) => {
  return await new jose.SignJWT({jobsTrackUname: uname})
  .setProtectedHeader({alg: "HS256"})
  .setIssuedAt()
  .setExpirationTime("14d")
  .sign(jwtSecret)
}

export const checkToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, jwtSecret, {algorithms: ["HS256"]})
    return payload.jobsTrackUname as string
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