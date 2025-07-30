import { useLocalStorage } from "@raycast/utils";
import { Project } from "../types/project";
import { Activities } from "../types/activity";
import moment from "moment";

export function useActivities() {
  let activities = useLocalStorage<Activities>("activities", {});
  return {
    ...activities,
    addActivity: async (start: Date, project: Project, description: string)=> {
      let date = moment(start)

      let year = date.year()
      let month = date.month() + 1
      let day = date.date()

      let value = activities.value

      if(!value)
        value = {}

      if(!value[year])
        value[year] = {}
      if(!value[year][month])
        value[year][month] = {}
      if(!value[year][month][day])
        value[year][month][day] = []

      value[year][month][day].push({
        startTime: start,
        endDate: new Date(),
        projectName: project.name,
        description
      })

      await activities.setValue(value)
    }
  };
}