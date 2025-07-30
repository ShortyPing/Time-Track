import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { Activities } from "./types/activity";
import moment from "moment";
import { useActivities } from "./hooks/use-activities";
import { useEffect, useState } from "react";

export default function Command() {

  const activitiesHolder = useActivities()

  const [ activities, setActivities ] = useState<Activities>({});


  useEffect(() => {
    if(!activitiesHolder.isLoading) {
      setActivities(activitiesHolder.value ?? {})
    }
  }, [activitiesHolder.isLoading]);
  return <List>
    <List.Section title={"Years"}>
      {Object.keys(activities).sort().reverse().map(year => <List.Item key={year} title={year} actions={<ActionPanel>
        <Action.Push title={"Select"} target={<MonthOverview year={parseInt(year)} activities={activities} />} />
      </ActionPanel>}>

      </List.Item>)}
    </List.Section>
  </List>;
}


function MonthOverview({ year, activities }: { year: number, activities: Activities }) {
  return <List>
    <List.Section title={"Months"}>
      {Object.keys(activities[year]).sort().reverse().map(month => {
        let monthName = moment().month(parseInt(month) - 1).format("MMMM");

        return <List.Item key={month} title={month} keywords={[monthName]}
                          subtitle={monthName} actions={<ActionPanel>
          <Action.Push title={"Select"}
                       target={<DayOverview year={year} month={parseInt(month)} activities={activities} />} />
        </ActionPanel>}>

        </List.Item>;
      })}
    </List.Section>
  </List>;
}

function DayOverview({ year, month, activities }: { year: number, month: number, activities: Activities }) {
  return <List>
    <List.Section title={"Days"}>
      {Object.keys(activities[year][month]).sort().reverse().map(day => {
        return <List.Item key={day} title={day.padStart(2, "0")}
                          subtitle={moment().year(year).month(month - 1).date(parseInt(day)).format("dddd")}
                          actions={<ActionPanel>
                            <Action.Push title={"Select"}
                                         target={<ActivitiesOnDay day={parseInt(day)} month={month} year={year}
                                                                  activities={activities} />} />
                          </ActionPanel>}>
        </List.Item>;
      })}
    </List.Section>
  </List>;
}

function ActivitiesOnDay({ year, month, day, activities }: {
  year: number,
  month: number,
  day: number,
  activities: Activities
}) {
  const date = moment().year(year).month(month - 1).date(day);

  return <List>
    <List.Section title={`Activities on ${date.calendar()}`}>
      {activities[year][month][day].toSorted((a, b) => b.startTime.getTime() - a.startTime.getTime()).map(activity =>
        <List.Item key={activity.startTime.getTime()}
                   accessories={[
                     {
                       icon: Icon.Play,
                       tag: {
                         value: moment(activity.startTime).format("LTS"),
                         color: Color.Green
                       }

                     },
                     {
                       icon: Icon.Stop,
                       tag: {
                         value: moment(activity.endDate).format("LTS"),
                         color: Color.Orange
                       }

                     }
                   ]}
                   actions={<ActionPanel>
                     <Action.CopyToClipboard title={"Copy project name"} content={activity.projectName} shortcut={{modifiers: ["cmd", "shift"], key: "p"}}/>
                     <Action.CopyToClipboard title={"Copy description"} content={activity.description} shortcut={{modifiers: ["cmd", "shift"], key: "d"}}/>
                   </ActionPanel>}
                   title={activity.projectName}
                   subtitle={activity.description} />)}
    </List.Section>
  </List>;

}