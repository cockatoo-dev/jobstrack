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
    let futureCount = 0
    let hasAcceptOffer = false
    let isFuture = false
    let isRemind = false

    if (job.updates.length === 0) {
      isRemind = !job.dismissRemind
    } else {
      updateType = job.updates[0].updateType
      updateTime = job.updates[0].updateDay
      for (const update of job.updates) {
        if (update.updateType === updateTypes.ACCEPT_OFFER) {
          hasAcceptOffer = true
          updateType = update.updateType
          updateTime = update.updateDay
        } else if (update.updateTime > Date.now()) {
          futureCount += 1
        }
      }
      if (futureCount > 0 && !hasAcceptOffer) {
        isFuture = userInfo.remindFuture
      } else if (
        updateType === updateTypes.ACCEPT_OFFER ||
        updateType === updateTypes.DECLINE_OFFER ||
        updateType === updateTypes.REJECT ||
        updateType === updateTypes.WAITLIST
      ) {
        isRemind = false
      } else if (updateType === updateTypes.RECEIVE_OFFER && !hasAcceptOffer) {
        isRemind = Date.now() - updateTime > DAY * userInfo.remindOfferDays
      } else if (!hasAcceptOffer) {
        isRemind = Date.now() - updateTime > DAY * userInfo.remindDays
      }
    }    

    const jobData = {
      jobId: job.jobId,
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      updateType,
      updateTime,
      futureCount,
      hasAcceptOffer,
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
    if (jobData.hasAcceptOffer) {
      acceptJobs.push(jobData)
    } else if (
      jobData.updateType === updateTypes.DECLINE_OFFER ||
      jobData.updateType === updateTypes.REJECT ||
      jobData.updateType === updateTypes.WAITLIST
    ) {
      notConsideredJobs.push(jobData)
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