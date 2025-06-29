"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { supabase } from '@/lib/supabaseClient'

export default function ProjectQuestionnairePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const projectId = id;

  // State for each category's rich text input
  const [projectInfo, setProjectInfo] = React.useState("")
  const [clientInfo, setClientInfo] = React.useState("")
  const [contractorInfo, setContractorInfo] = React.useState("")
  const [initialLoading, setInitialLoading] = React.useState(true)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  // Extract values for actions
  const projectName = projectInfo || "Project"
  const clientName = clientInfo || "Client"
  const projectUrl = `https://senses-integration/questionaire/${id}`;

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [originalData, setOriginalData] = React.useState({
    projectInfo: '',
    clientInfo: '',
    contractorInfo: ''
  });
  const saveInProgressRef = React.useRef(false);
  const skipChangeTrackingRef = React.useRef(false);

  // Fetch project data on component mount
  React.useEffect(() => {
    async function fetchProjectData() {
      if (!projectId) return;
      
      setInitialLoading(true);
      setFetchError(null);
      
      try {
        const { data, error } = await supabase
          .from('questionnaire_data')
          .select('project_name, client_name, contractor')
          .eq('project_id', projectId)
          .single();
        
        if (error) {
          console.error('Error fetching project:', error);
          setFetchError(error.message);
        } else if (data) {
          const projectName = data.project_name || '';
          const clientName = data.client_name || '';
          const contractor = data.contractor || '';
          
          setProjectInfo(projectName);
          setClientInfo(clientName);
          setContractorInfo(contractor);
          setOriginalData({
            projectInfo: projectName,
            clientInfo: clientName,
            contractorInfo: contractor
          });
          setHasUnsavedChanges(false);
        } else {
          setFetchError('Project not found');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setFetchError('Failed to load project data');
      } finally {
        setInitialLoading(false);
      }
    }
    
    fetchProjectData();
  }, [projectId]);

  // Track unsaved changes
  React.useEffect(() => {
    // Skip change tracking if we're in the middle of a save operation
    if (skipChangeTrackingRef.current) {
      console.log('Skipping change tracking - save in progress');
      return;
    }

    // Small delay to prevent race conditions during save operations
    const timer = setTimeout(() => {
      const hasChanges = 
        projectInfo !== originalData.projectInfo ||
        clientInfo !== originalData.clientInfo ||
        contractorInfo !== originalData.contractorInfo;
      
      console.log('Checking for changes:', {
        current: { projectInfo, clientInfo, contractorInfo },
        original: originalData,
        hasChanges,
        skipTracking: skipChangeTrackingRef.current
      });
      
      setHasUnsavedChanges(hasChanges);
    }, 10);

    return () => clearTimeout(timer);
  }, [projectInfo, clientInfo, contractorInfo, originalData]);

  // Keyboard shortcut for saving (Ctrl+S / Cmd+S)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && !loading) {
          handleSave();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, loading]);

  const handleSave = async () => {
    // Prevent multiple simultaneous saves using both state and ref
    if (loading || saveInProgressRef.current) {
      console.log('Save already in progress, skipping...');
      return;
    }

    // Mark save as in progress and skip change tracking temporarily
    saveInProgressRef.current = true;
    skipChangeTrackingRef.current = true;

    // Capture current values to prevent stale closures
    const currentProjectInfo = projectInfo;
    const currentClientInfo = clientInfo;
    const currentContractorInfo = contractorInfo;

    console.log('Starting save with values:', {
      projectInfo: currentProjectInfo,
      clientInfo: currentClientInfo,
      contractorInfo: currentContractorInfo
    });

    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('Attempting database update for project_id:', projectId);
      
      const { data, error, count } = await supabase
        .from('questionnaire_data')
        .update({
          project_name: currentProjectInfo || '',
          client_name: currentClientInfo || '',
          contractor: currentContractorInfo || '',
        })
        .eq('project_id', projectId)
        .select(); // Return the updated data to confirm the save

      console.log('Database response:', { data, error, count });

      if (error) {
        console.error('Supabase save error:', error);
        
        // Check for common RLS policy issues
        if (error.message?.includes('new row violates row-level security policy') || 
            error.message?.includes('insufficient privilege') ||
            error.code === 'PGRST301') {
          throw new Error('Permission denied: Please ensure you have UPDATE policies set up in Supabase for the questionnaire_data table.');
        }
        
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('No rows were updated. Project might not exist.');
        throw new Error('No rows were updated. Project might not exist.');
      }

      console.log('Save successful! Updated row:', data[0]);
      
      // Verify the data was actually saved by checking the returned values
      const savedData = data[0];
      console.log('Confirmed saved values:', {
        project_name: savedData.project_name,
        client_name: savedData.client_name,
        contractor: savedData.contractor
      });
      
      // Update original data with the values that were actually saved from the database
      const newOriginalData = {
        projectInfo: savedData.project_name || '',
        clientInfo: savedData.client_name || '',
        contractorInfo: savedData.contractor || ''
      };
      
      console.log('Setting original data to:', newOriginalData);
      console.log('Current form values:', { 
        projectInfo: currentProjectInfo, 
        clientInfo: currentClientInfo, 
        contractorInfo: currentContractorInfo 
      });
      
      // Update the original data state
      setOriginalData(newOriginalData);
      
             // Explicitly set hasUnsavedChanges to false
       console.log('Explicitly setting hasUnsavedChanges to false');
       setHasUnsavedChanges(false);
       
       // Re-enable change tracking after a short delay
       setTimeout(() => {
         skipChangeTrackingRef.current = false;
         console.log('Change tracking re-enabled');
       }, 100);
       
       setSuccess(true);
       setTimeout(() => setSuccess(false), 3000);
      
    } catch (err: any) {
      console.error('Save failed:', err);
      setError(err.message || 'Failed to save');
      
      // Re-enable change tracking on error too
      skipChangeTrackingRef.current = false;
    } finally {
      setLoading(false);
      saveInProgressRef.current = false;
    }
  };

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
  }

  function handleDelete() {
    // Placeholder for delete logic
    alert("Delete Project action triggered.")
  }

  // Show loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 w-full max-w-none">
        <div className="text-center py-8">
          <div className="text-lg">Loading project data...</div>
        </div>
      </div>
    );
  }

  // Show error state if project couldn't be loaded
  if (fetchError) {
    return (
      <div className="flex flex-col gap-6 p-4 w-full max-w-none">
        <div className="text-center py-8">
          <div className="text-lg text-red-500">Error: {fetchError}</div>
          <div className="text-sm text-gray-500 mt-2">Project ID: {projectId}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-none">
      {/* Editable Info Card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Project & Contact Information</CardTitle>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                Unsaved changes
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="projectInfo" className="uppercase text-xs tracking-widest text-gray-500 mb-1">Project Name</Label>
            <Input
              id="projectInfo"
              name="projectInfo"
              value={projectInfo}
              onChange={e => setProjectInfo(e.target.value)}
              placeholder="Enter project name..."
              className="w-full text-base"
            />
          </div>
          <div>
            <Label htmlFor="clientInfo" className="uppercase text-xs tracking-widest text-gray-500 mb-1">Client Name</Label>
            <Input
              id="clientInfo"
              name="clientInfo"
              value={clientInfo}
              onChange={e => setClientInfo(e.target.value)}
              placeholder="Enter client name..."
              className="w-full text-base"
            />
          </div>
          <div>
            <Label htmlFor="contractorInfo" className="uppercase text-xs tracking-widest text-gray-500 mb-1">Contractor</Label>
            <Input
              id="contractorInfo"
              name="contractorInfo"
              value={contractorInfo}
              onChange={e => setContractorInfo(e.target.value)}
              placeholder="Enter contractor name..."
              className="w-full text-base"
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

      {/* Actions: Refresh and Save */}
      <div className="flex gap-2 justify-end w-full">
        <Button
          variant="outline"
          onClick={async () => {
            if (!projectId) return;
            
            try {
              const { data, error } = await supabase
                .from('questionnaire_data')
                .select('project_name, client_name, contractor')
                .eq('project_id', projectId)
                .single();
              
              if (error) {
                console.error('Error refreshing project:', error);
                setError('Failed to refresh project data');
              } else if (data) {
                const projectName = data.project_name || '';
                const clientName = data.client_name || '';
                const contractor = data.contractor || '';
                
                setProjectInfo(projectName);
                setClientInfo(clientName);
                setContractorInfo(contractor);
                setOriginalData({
                  projectInfo: projectName,
                  clientInfo: clientName,
                  contractorInfo: contractor
                });
                setHasUnsavedChanges(false);
                setError(null);
              }
            } catch (err: any) {
              console.error('Refresh error:', err);
              setError('Failed to refresh project data');
            }
          }}
        >
          Refresh
        </Button>
        <Button
          variant={hasUnsavedChanges ? "default" : "outline"}
          onClick={handleSave}
          disabled={loading || !hasUnsavedChanges}
          className={hasUnsavedChanges ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          {loading ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
        </Button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="font-medium">Error saving changes:</div>
          <div>{error}</div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <div className="font-medium">✓ Changes saved successfully!</div>
        </div>
      )}
      {hasUnsavedChanges && !error && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
          <div className="text-sm">
            💡 <strong>Tip:</strong> Press <kbd className="bg-white px-2 py-1 rounded border text-xs">Ctrl+S</kbd> (or <kbd className="bg-white px-2 py-1 rounded border text-xs">⌘+S</kbd> on Mac) to save quickly
          </div>
        </div>
      )}

      {/* Questionnaire Section - Coming Soon */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Corporate Design Questionnaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg font-medium">Questionnaire Coming Soon</div>
            <div className="text-sm mt-2">The detailed questionnaire interface will be added here.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 