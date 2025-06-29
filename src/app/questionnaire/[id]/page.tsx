"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"

export default function ProjectQuestionnairePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const projectId = id;

  // State for each category's rich text input
  const [projectInfo, setProjectInfo] = React.useState(
    "PAN Corporate Design Project"
  )
  const [clientInfo, setClientInfo] = React.useState(
    "Mohamed Bin Zayed University Of Artificial Intelligence\nMasdar City, Knowledge Centre, 2nd Floor\nAbu Dhabi, UAE"
  )
  const [contractorInfo, setContractorInfo] = React.useState(
    "Senses Integration\nFriedrich Straße 17\n10969 Berlin Germany"
  )

  // Example values for actions
  const projectName = projectInfo.split("\n")[0] || "PAN"
  const clientName = clientInfo.split("\n")[0] || "Client"
  const projectUrl = `https://senses-integration/questionaire/${id}`;

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
  }

  function handleDelete() {
    // Placeholder for delete logic
    alert("Delete Project action triggered.")
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-none">
      {/* Editable Info Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Project & Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="projectInfo" className="uppercase text-xs tracking-widest text-gray-500 mb-1">Project</Label>
            <textarea
              id="projectInfo"
              name="projectInfo"
              value={projectInfo}
              onChange={e => setProjectInfo(e.target.value)}
              rows={3}
              className="w-full border rounded-md p-2 text-base font-mono"
            />
          </div>
          <div>
            <Label htmlFor="clientInfo" className="uppercase text-xs tracking-widest text-gray-500 mb-1">Client</Label>
            <textarea
              id="clientInfo"
              name="clientInfo"
              value={clientInfo}
              onChange={e => setClientInfo(e.target.value)}
              rows={3}
              className="w-full border rounded-md p-2 text-base font-mono"
            />
          </div>
          <div>
            <Label htmlFor="contractorInfo" className="uppercase text-xs tracking-widest text-gray-500 mb-1">Contractor</Label>
            <textarea
              id="contractorInfo"
              name="contractorInfo"
              value={contractorInfo}
              onChange={e => setContractorInfo(e.target.value)}
              rows={3}
              className="w-full border rounded-md p-2 text-base font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => handleCopy(projectId)}>
            Copy project ID
          </Button>
          <Button variant="outline" onClick={() => handleCopy(projectName)}>
            Copy project name
          </Button>
          <Button variant="outline" onClick={() => handleCopy(clientName)}>
            Copy client name
          </Button>
          <Button variant="outline" onClick={() => handleCopy(projectUrl)}>
            Copy URL
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Project
          </Button>
        </CardContent>
      </Card>

      {/* Questionnaire Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Corporate Design Questionnaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-bold w-6 flex-shrink-0">{i + 1}.</span>
              <span className="font-semibold">Placeholder question {i + 1} goes here.</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 