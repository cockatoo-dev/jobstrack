export type clientUpdate = {
  updateName: string,
  updateText: string,
  updateTime: number
}

export type clientJob = {
  companyName: string,
  jobTitle: string,
  jobDescription: string,
  lastUpdateText: string,
  displayFlag: number
  updates: [clientUpdate]
}

export type clientJobUpdate = {
  companyName: string,
  jobTitle: string,
  jobDescription: string,
  lastUpdateText: string,
  displayFlag: number
}

export type clientUserSettings = {
  remindDays: number,
  remindOfferDays: number
}