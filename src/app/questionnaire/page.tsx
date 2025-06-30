"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { ProjectsDataTable } from "@/components/projects-data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

// Function to generate random project ID in format XXXX-XXXX-XXXX-XXXX
function generateProjectId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const segments = [];
  
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  
  return segments.join('-');
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Form state
  const [projectName, setProjectName] = React.useState('');
  const [clientName, setClientName] = React.useState('');
  const [contractor, setContractor] = React.useState('Senses Integration');
  const [previewProjectId, setPreviewProjectId] = React.useState('');

  // Generate a preview project ID when dialog opens
  React.useEffect(() => {
    if (isDialogOpen) {
      setPreviewProjectId(generateProjectId());
    }
  }, [isDialogOpen]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim() || !clientName.trim()) {
      setError('Project name and client name are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const projectId = previewProjectId || generateProjectId();
      console.log('Creating new project with ID:', projectId);

      const { data, error } = await supabase
        .from('questionnaire_data')
        .insert([{
          project_id: projectId,
          project_name: projectName.trim(),
          client_name: clientName.trim(),
          contractor: contractor.trim(),
        }])
        .select();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      console.log('Project created successfully:', data);

      // Reset form
      setProjectName('');
      setClientName('');
      setContractor('Senses Integration');
      setPreviewProjectId('');
      setIsDialogOpen(false);

      // Navigate to the new project page
      router.push(`/questionnaire/${projectId}`);
      
    } catch (err: unknown) {
      console.error('Failed to create project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Projects</h2>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateProject}>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add the details for your new project. A unique project ID will be generated automatically.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Project ID (Auto-generated)</Label>
                      <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm font-mono text-gray-600">
                        {previewProjectId || 'XXXX-XXXX-XXXX-XXXX'}
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="projectName">Project Name *</Label>
                      <Input
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Enter project name..."
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        id="clientName"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Enter client name..."
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="contractor">Contractor</Label>
                      <Input
                        id="contractor"
                        value={contractor}
                        onChange={(e) => setContractor(e.target.value)}
                        placeholder="Enter contractor name..."
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                      <div className="font-medium">Error:</div>
                      <div>{error}</div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Project'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <ProjectsDataTable />
        </div>
      </div>
    </>
  );
} 