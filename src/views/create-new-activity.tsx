import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { Project } from "../types/project";
import { useProjects } from "../hooks/use-projects";

export default function CreateActivity({initialSelectedProjectId, createTracking}: {initialSelectedProjectId?: string, createTracking: (projectId: string, description: string) => Promise<void>}) {


  const { value: projects, setValue: setProjects, isLoading } = useProjects()
  const {pop} = useNavigation()



  console.log(projects, setProjects, isLoading)

  return <Form isLoading={isLoading} actions={<ActionPanel>
    <Action.SubmitForm title={"Create"} onSubmit={async values => {
      await createTracking(values["project"], values["description"])
      pop()
    }}/>
  </ActionPanel>}>
    {!isLoading && <Form.Dropdown id={"project"} title={"Project"} defaultValue={initialSelectedProjectId}>
      {projects!!.map(project => <Form.Dropdown.Item key={project.id} value={project.id} title={project.name} />)}
    </Form.Dropdown>}
    <Form.TextField id={"description"} title={"Description"}/>
  </Form>
}