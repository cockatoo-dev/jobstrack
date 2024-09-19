import { getJobsByUserBeta, getUserSettingsBeta } from "../../db/db"
import { checkToken, type dashboardJobItem, TOKEN_COOKIE, updateTypes } from "../../utils/utils"

const daysApart = (time: number, demoMode: boolean) => {
  if (demoMode) {
    return (Date.now() - time) / 60000
  } else {
    return (Date.now() - time) / 86400000
  }
}

export default defineEventHandler(async (e) => {
  const uname = await checkToken(getCookie(e, TOKEN_COOKIE))
  const settings = await getUserSettingsBeta(uname)
  const dbJobs = await getJobsByUserBeta(uname)

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
  let hasOffer = false

  for (const job of dbJobs) {
    isFuture = false
    isRemind = false
    if (!job.dismissRemind) {
      if (
        job.lastUpdateType === updateTypes.RECEIVE_OFFER &&
        daysApart(job.lastUpdateTime, settings.demoMode) >= settings.remindOfferDays
      ) {
        isRemind = true
      } else if (job.lastUpdateTime > Date.now()) {
        isFuture = true
      } else if (
        daysApart(job.lastUpdateTime, settings.demoMode) >= settings.remindDays &&
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
      hasOffer = true
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
    uname,
    ...settings,
    hasOffer,
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