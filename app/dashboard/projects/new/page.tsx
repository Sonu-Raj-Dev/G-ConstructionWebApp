import { NewProjectForm } from "@/components/projects/new-project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">New Project</h1>
      </div>
      <NewProjectForm />
    </div>
  )
}
