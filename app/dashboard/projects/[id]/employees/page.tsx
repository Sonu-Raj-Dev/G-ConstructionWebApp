import { getProjectById } from "@/app/actions/projects";
import { getEmployees } from "@/app/actions/employees";
import { ProjectEmployeesManager } from "@/components/projects/project-employees-manager";

export const dynamic = "force-dynamic";

export default async function ProjectEmployeesPage({
  params,
}: {
  params: { id: string };
}) {
  // Await the params to access its properties
  const { id } = await params;

  const projectResult = await getProjectById(id);
  const employeesResult = await getEmployees();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage Project Employees</h1>
      </div>
      {projectResult.success && employeesResult.success ? (
        <ProjectEmployeesManager
          project={projectResult.project}
          employees={employeesResult.employees}
        />
      ) : (
        <p className="text-red-500">
          Error: {projectResult.error || employeesResult.error || "Failed to load data"}
        </p>
      )}
    </div>
  );
}
