import { ProjectsHeader } from "@/components/projects/header"
import { ProjectsList } from "@/components/projects/list"

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <ProjectsHeader />
      <ProjectsList />
    </div>
  )
}
