import { getJobsByUser, getUserInfo } from "../../db/db"
import { checkBetaToken, checkRemind, type dashboardJobItem, TOKEN_COOKIE, updateTypes } from "../../utils/serverUtils"



export default defineEventHandler(async (e) => {
  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))
  const userInfo = await getUserInfo(userId)
  const dbJobs = await getJobsByUser(userId)

  const allJobs: dashboardJobItem[] = []
  const futureJobs: dashboardJobItem[] = []
  const remindJobs: dashboardJobItem[] = []
  const acceptJobs: dashboardJobItem[] = []
  const offerJobs: dashboardJobItem[] = []
  const finalJobs: dashboardJobItem[] = []
  const interviewJobs: dashboardJobItem[] = []
  const appliedJobs: dashboardJobItem[] = []
  const notAppliedJobs: dashboardJobItem[] = []
  const notConsideredJobs: dashboardJobItem[] = []

  let isFuture = false
  let isRemind = false

  for (const job of dbJobs) {
    isFuture = false
    isRemind = false
    if (!job.dismissRemind) {
      if (job.lastUpdateTime > Date.now()) {
        isFuture = true
      } else {
        isRemind = checkRemind(
          job.lastUpdateType,
          job.lastUpdateTime,
          userInfo.remindDays,
          userInfo.remindOfferDays
        )
      }
    }

    if (isFuture) {
      futureJobs.push({...job, isFuture, isRemind})
    } else if (isRemind) {
      remindJobs.push({...job, isFuture, isRemind})
    }
    if (
      job.lastUpdateType === updateTypes.DECLINE_OFFER ||
      job.lastUpdateType === updateTypes.REJECT ||
      job.lastUpdateType === updateTypes.WAITLIST
    ) {
      notConsideredJobs.push({...job, isFuture, isRemind})
    } else if (job.lastUpdateType === updateTypes.ACCEPT_OFFER) {
      acceptJobs.push({...job, isFuture, isRemind})
    } else if (job.lastUpdateType === updateTypes.RECEIVE_OFFER) {
      offerJobs.push({...job, isFuture, isRemind})
    } else if (
      job.lastUpdateType === updateTypes.ASSESS_CENTER ||
      job.lastUpdateType === updateTypes.FINAL_INTERVIEW
    ) {
      finalJobs.push({...job, isFuture, isRemind})
    } else if (job.lastUpdateType === updateTypes.APPLICATION_SENT) {
      appliedJobs.push({...job, isFuture, isRemind})
    } else if (job.lastUpdateType === updateTypes.NO_APPLICATION) {
      notAppliedJobs.push({...job, isFuture, isRemind})
    } else {
      interviewJobs.push({...job, isFuture, isRemind})
    }

    allJobs.push({...job, isFuture, isRemind})
  }

  return {
    timestamp: Date.now(),
    ...userInfo,
    allJobs,
    futureJobs,
    remindJobs,
    acceptJobs,
    offerJobs,
    finalJobs,
    interviewJobs,
    appliedJobs,
    notAppliedJobs,
    notConsideredJobs
  }
})