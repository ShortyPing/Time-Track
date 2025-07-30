export interface Project {
  id: string,
  name: string,
  createdAt: Date,
  currentTrackingActivity?: TrackingActivity
}

export interface TrackingActivity {
  startDate: Date,
  description: string
}

