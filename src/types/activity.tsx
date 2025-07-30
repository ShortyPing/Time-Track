
export interface Activity {
  projectName: string,
  description: string,
  startTime: Date,
  endDate: Date
}

export interface Activities {
  [year: number]: {
    [month: number]: {
      [day: number]: Activity[]
    }
  }
}