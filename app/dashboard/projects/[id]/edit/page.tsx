import { getProjectById } from "@/app/actions/projects"
import { EditProjectForm } from "@/components/projects/edit-project-form"

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const { success, project, error } = await getProjectById(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
      </div>
      {success ? <EditProjectForm project={project} /> : <p className="text-red-500">Error: {error}</p>}
    </div>
  )
}
