import { Action, ActionPanel, Color, confirmAlert, Icon, Keyboard, List, showToast, Toast } from "@raycast/api";
import { Project } from "./types/project";
import CreateProject from "./views/create-project";
import { formatDate } from "./utils";
import { useProjects } from "./hooks/use-projects";
import CreateActivity from "./views/create-new-activity";
import { useActivities } from "./hooks/use-activities";
import Shortcut = Keyboard.Shortcut;
import Style = Toast.Style;


export default function Command() {


  const { value: projects, setValue: setProjects, isLoading } = useProjects();
  const activities = useActivities()

  async function addProject(project: Project) {
    await setProjects([...projects!!, project]);
  }

  async function deleteProject(projectId: string) {
    await setProjects(projects!!.filter(project => project.id != projectId));
  }


  async function createTracking(projectId: string, description: string) {
    await setProjects(projects!!.map(p => p.id == projectId ? {
      ...p,
      currentTrackingActivity: { startDate: new Date(), description: description }
    } : p));
  }


  async function removeTracking(project: Project) {
    await setProjects(projects!!.map(p => p.id == project.id ? {
      ...p,
      currentTrackingActivity: undefined
    } : p));
  }


  function renderProject(project: Project) {

    let accessories: List.Item.Accessory[] = [];

    if (!!project.currentTrackingActivity) {
      accessories.push({
        tag: {
          value: project.currentTrackingActivity?.description,
          color: Color.Blue
        }
      });
      accessories.push({
        date: {
          value: project.currentTrackingActivity.startDate,
          color: Color.Green
        }
      })
    }

    return <List.Item
      icon={Icon.Folder}
      key={project.id}
      title={project.name}
      subtitle={formatDate(project.createdAt)}
      accessories={accessories}
      actions={<ActionPanel>
        {!project.currentTrackingActivity ?
          <Action.Push title={"Start tracking"} target={<CreateActivity initialSelectedProjectId={project.id} createTracking={createTracking}/>} />
          :
          <Action title={"Stop tracking"} onAction={async () => {
            if(await confirmAlert({title: "Are you sure that you want to stop the tracking of the current project?"})) {
              await activities.addActivity(project.currentTrackingActivity!!.startDate, project, project.currentTrackingActivity!!.description)
              await removeTracking(project)
            }
          }} />}

        <Action.Push shortcut={Shortcut.Common.New} title={"Create new project"}
                     target={<CreateProject addProject={addProject} />} />
        <Action shortcut={Shortcut.Common.Remove} title={"Delete project"} onAction={async () => {
          if (await confirmAlert({ title: "Are you sure that you want to delete the project?" })) {
            await deleteProject(project.id);
            await showToast({
              style: Style.Success,
              title: "Project deleted"
            });


          }
        }} />
      </ActionPanel>}
    />;
  }

  return (
    <List isLoading={isLoading} actions={<ActionPanel>
      <Action.Push shortcut={Shortcut.Common.New} title={"Create new project"}
                   target={<CreateProject addProject={addProject} />} />
    </ActionPanel>}>
      <List.Section title={"Currently tracking"}>
        {projects?.filter(project => !!project.currentTrackingActivity).map(project => renderProject(project))}
      </List.Section>
      <List.Section title={"Not tracking"}>
        {projects?.filter(project => !project.currentTrackingActivity).map(project => renderProject(project))}
      </List.Section>

    </List>
  );
}
