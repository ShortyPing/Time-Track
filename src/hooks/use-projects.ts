import { useLocalStorage } from "@raycast/utils";
import { Project } from "../types/project";

export function useProjects() {
  return useLocalStorage<Project[]>("projects", []);
}