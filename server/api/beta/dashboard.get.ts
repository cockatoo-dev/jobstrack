import { getJobsByUser, getUserSettingsBeta } from "../../db/db"
import { checkBetaToken, type dashboardJobItem, TOKEN_COOKIE, updateTypes } from "../../utils/utils"

const daysApart = (time: number) => {
  return (Date.now() - time) / 86400000
}

export default defineEventHandler(async (e) => {
  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))
  const settings = await getUserSettingsBeta(userId)
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
      if (
        job.lastUpdateType === updateTypes.RECEIVE_OFFER &&
        daysApart(job.lastUpdateTime) >= settings.remindOfferDays
      ) {
        isRemind = true
      } else if (job.lastUpdateTime > Date.now()) {
        isFuture = true
      } else if (
        daysApart(job.lastUpdateTime) >= settings.remindDays &&
        job.lastUpdateType < updateTypes.ACCEPT_OFFER
      ) {
        isRemind = true
      } else if (job.lastUpdateType === updateTypes.NO_APPLICATION) {
        isRemind = true
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
    uname: userId,
    ...settings,
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