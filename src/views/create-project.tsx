import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { useForm } from "@raycast/utils";
import { Project } from "../types/project";
import { v4 } from "uuid";
import { useState } from "react";

interface CreateProjectFormValues {
  name: string
}

function createProject(name: string): Project {
  return {
    id: v4(),
    name: name,
    createdAt: new Date()
  }
}

export default function CreateProject({addProject}: {addProject: (project: Project) => Promise<void>}) {


  const [loading, setLoading] = useState(false)
  const {pop} = useNavigation()

  const {handleSubmit, itemProps} = useForm<CreateProjectFormValues>({
    onSubmit: values => {
      setLoading(true)

      addProject(createProject(values.name)).then(pop)
    }
  })

  return <Form actions={<ActionPanel>
    <Action.SubmitForm title={"Create"} onSubmit={handleSubmit}/>
  </ActionPanel>}>
    <Form.TextField title={"Project Name"} placeholder={"Project 1"} {...itemProps.name} />
  </Form>
}