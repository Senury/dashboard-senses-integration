import { PageHeader } from "@/components/page-header"

export default function QuestionnairePage() {
  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-semibold mb-6">Questionnaire</h1>
          <p className="text-gray-600">Questionnaire content will go here.</p>
        </div>
      </div>
    </>
  );
} 