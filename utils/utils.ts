export const timeToDaysString = (time: number) => {
  const DAY = 86400000
  
  const nowDate = new Date()
  const timeDate = new Date(time)
  const nowMsec = nowDate.getTime()
  const nowDay = new Date(nowDate.toDateString())
  const timeDay = new Date(timeDate.toDateString())

  let daysDiff = 0
  let hoursStr = ""
  let minutesStr = ""
  if (time > nowMsec) {
    daysDiff = Math.floor((timeDay.getTime() - nowDay.getTime()) / DAY)
    hoursStr = timeDate.getHours() < 10 ? `0${timeDate.getHours()}` : `${timeDate.getHours()}`
    minutesStr = timeDate.getMinutes() < 10 ? `0${timeDate.getMinutes()}` : `${timeDate.getMinutes()}`
    if (daysDiff === 0) {
      return `today at ${hoursStr}:${minutesStr}`
    } else if (daysDiff === 1) {
      return `tomorrow at ${hoursStr}:${minutesStr}`
    } else {
      return `in ${daysDiff} days`
    }
  } else {
    daysDiff = Math.floor((nowDay.getTime() - timeDay.getTime()) / DAY)
    if (daysDiff === 0) {
      return "today"
    } else if (daysDiff === 1) {
      return "yesterday"
    } else {
      return `${daysDiff} days ago`
    }
  }
}

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

export const getUpdateName = (updateType: updateTypes) => {
  if (updateType === updateTypes.APPLICATION_SENT) {
    return "Sent Application"
  } else if (updateType === updateTypes.ONLINE_ASSESS) {
    return "Online Assessment"
  } else if (updateType === updateTypes.INTERVIEW) {
    return "Interview"
  } else if (updateType === updateTypes.PHONE_INTERVIEW) {
    return "Phone Interview"
  }else if (updateType === updateTypes.VIRTUAL_INTERVIEW) {
    return "Virtual Interview"
  } else if (updateType === updateTypes.TECH_INTERVIEW) {
    return "Technical Interview"
  } else if (updateType === updateTypes.BEHAVE_INTERVIEW) {
    return "Behavioural Interview"
  } else if (updateType === updateTypes.FINAL_INTERVIEW) {
    return "Final Interview"
  } else if (updateType === updateTypes.ASSESS_CENTER) {
    return "Assessment Center"
  } else if (updateType === updateTypes.RECEIVE_OFFER) {
    return "Received Offer"
  } else if (updateType === updateTypes.ACCEPT_OFFER) {
    return "Accepted Offer"
  } else if (updateType === updateTypes.DECLINE_OFFER) {
    return "Declined Offer"
  } else if (updateType === updateTypes.REJECT) {
    return "Rejected"
  } else if (updateType === updateTypes.WAITLIST) {
    return "Placed on Waitlist"
  } else return ""
}

export const getUpdateAction = (updateType: updateTypes, time: number) => {
  let daysString = ""
  if (updateType !== updateTypes.NO_APPLICATION) {
    daysString = timeToDaysString(time)
  }
  
  if (updateType === updateTypes.APPLICATION_SENT) {
    return `You submitted your application ${daysString}.`
  } else if (updateType === updateTypes.ONLINE_ASSESS) {
    return `You completed an online assessment ${daysString}.`
  } else if (updateType === updateTypes.INTERVIEW) {
    if (Date.now() < time) {
      return `You have a interview ${daysString}.`
    } else {
      return `You had an interview ${daysString}.`
    }
  } else if (updateType === updateTypes.PHONE_INTERVIEW) {
    if (Date.now() < time) {
      return `You have a phone interview ${daysString}.`
    } else {
      return `You had a phone interview ${daysString}.`
    }
  } else if (updateType === updateTypes.VIRTUAL_INTERVIEW) {
    if (Date.now() < time) {
      return `You have a virtual interview ${daysString}.`
    } else {
      return `You had a virtual interview ${daysString}.`
    }
  } else if (updateType === updateTypes.TECH_INTERVIEW) {
    if (Date.now() < time) {
      return `You have a technical interview ${daysString}.`
    } else {
      return `You had a technical interview ${daysString}.`
    }
  } else if (updateType === updateTypes.BEHAVE_INTERVIEW) {
    if (Date.now() < time) {
      return `You have a behavioural interview ${daysString}.`
    } else {
      return `You had a behavioural interview ${daysString}.`
    }
  } else if (updateType === updateTypes.FINAL_INTERVIEW) {
    if (Date.now() < time) {
      return `You have a final interview ${daysString}.`
    } else {
      return `You had a final interview ${daysString}.`
    }
  } else if (updateType === updateTypes.ASSESS_CENTER) {
    if (Date.now() < time) {
      return `You have an assessment center ${daysString}.`
    } else {
      return `You attended an assessment center ${daysString}.`
    }
  } else if (updateType === updateTypes.RECEIVE_OFFER) {
    return `You received an offer ${daysString}.`
  } else if (updateType === updateTypes.ACCEPT_OFFER) {
    return `You accepted an offer ${daysString}.`
  } else if (updateType === updateTypes.DECLINE_OFFER) {
    return `You declined an offer ${daysString}.`
  } else if (updateType === updateTypes.REJECT) {
    return `You were rejected ${daysString}.`
  } else if (updateType === updateTypes.WAITLIST) {
    return `You were placed on a waitlist ${daysString}.`
  } else return "You haven't applied to this job yet."
}

export type clientUpdate = {
  updateName: string,
  updateText: string,
  updateTime: number
}

export type clientJob = {
  jobId: string,
  companyName: string,
  jobTitle: string,
  jobDescription: string,
  lastUpdateText: string,
  displayFlag: number
  updates: [clientUpdate]
}

export type clientJobItem = {
  jobId: string,
  companyName: string,
  jobTitle: string,
  lastUpdateText: string,
  displayFlag: number
}

export type clientUserSettings = {
  remindDays: number,
  remindOfferDays: number
}