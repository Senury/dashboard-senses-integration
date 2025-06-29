import { PageHeader } from "@/components/page-header"
import { ProjectsDataTable } from "@/components/projects-data-table"

export default function QuestionnairePage() {
  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-semibold mb-6">Questionnaire</h1>
          <p className="text-gray-600 mb-6">Questionnaire content will go here.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Projects</h2>
          <ProjectsDataTable />
        </div>
      </div>
    </>
  );
} 