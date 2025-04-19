import { getProjectById } from "@/app/actions/projects"
import { CompleteProjectForm } from "@/components/projects/complete-project-form"

export default async function CompleteProjectPage({ params }: { params: { id: string } }) {
  const { success, project, error } = await getProjectById(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Complete Project</h1>
      </div>
      {success ? <CompleteProjectForm project={project} /> : <p className="text-red-500">Error: {error}</p>}
    </div>
  )
}
