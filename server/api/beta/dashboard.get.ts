import { getDashboardJobs, getUserInfo } from "../../db/db"
import { DAY } from "#imports"

export default defineEventHandler(async (e) => {
  const userId = await checkBetaToken(getCookie(e, TOKEN_COOKIE))
  const userInfo = await getUserInfo(userId)

  const dbJobs = await getDashboardJobs(userId)

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

  for (const job of dbJobs) { 
    let updateType = updateTypes.NO_APPLICATION
    let updateTime = -1
    let futureIndex = 0
    let checkFuture = true
    let isFuture = false
    let isRemind = false

    // Get earliest future update (if any), or latest past update.
    // Updates already sorted by DB on updateTime descending.
    if (job.updates.length === 0) {
      isRemind = !job.dismissRemind
    } else if (job.updates[0].updateTime > Date.now()) {
      while (checkFuture) {
        if (futureIndex === job.updates.length) {
          checkFuture = false
        } else if (job.updates[futureIndex + 1].updateTime > Date.now()) {
          checkFuture = false
        } else {
          futureIndex += 1
        }
      }
      updateType = job.updates[futureIndex].updateType
      updateTime = job.updates[futureIndex].updateTime
      isFuture = userInfo.remindFuture
    } else {
      updateType = job.updates[0].updateType
      updateTime = job.updates[0].updateDay
      if (
        updateType === updateTypes.ACCEPT_OFFER ||
        updateType === updateTypes.DECLINE_OFFER ||
        updateType === updateTypes.REJECT ||
        updateType === updateTypes.WAITLIST
      ) {
        isRemind = false
      } else if (updateType === updateTypes.RECEIVE_OFFER) {
        isRemind = Date.now() - updateTime > DAY * userInfo.remindOfferDays
      } else {
        isRemind = Date.now() - updateTime > DAY * userInfo.remindDays
      }
    }

    const jobData = {
      jobId: job.jobId,
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      updateType,
      updateTime,
      isFuture,
      isRemind
    }
    allJobs.push(jobData)
    
    // Set reminders view jobs
    if (jobData.isFuture) {
      futureJobs.push(jobData)
    } else if (jobData.isRemind) {
      remindJobs.push(jobData)
    }

    // Set stages view jobs
    if (
      jobData.updateType === updateTypes.DECLINE_OFFER ||
      jobData.updateType === updateTypes.REJECT ||
      jobData.updateType === updateTypes.WAITLIST
    ) {
      notConsideredJobs.push(jobData)
    } else if (jobData.updateType === updateTypes.ACCEPT_OFFER) {
      acceptJobs.push(jobData)
    } else if (jobData.updateType === updateTypes.RECEIVE_OFFER) {
      offerJobs.push(jobData)
    } else if (
      jobData.updateType === updateTypes.ASSESS_CENTER ||
      jobData.updateType === updateTypes.FINAL_INTERVIEW
    ) {
      finalJobs.push(jobData)
    } else if (jobData.updateType === updateTypes.APPLICATION_SENT) {
      appliedJobs.push(jobData)
    } else if (jobData.updateType === updateTypes.NO_APPLICATION) {
      notAppliedJobs.push(jobData)
    } else {
      interviewJobs.push(jobData)
    }
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