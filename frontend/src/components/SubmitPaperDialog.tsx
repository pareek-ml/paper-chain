import { useState, useMemo } from 'react';
import { useSubmitPaper, useGetAllPapers, useGetReviewsForPaper } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ExternalBlob } from '../backend';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';
import { Upload, Link as LinkIcon, Loader2, Info } from 'lucide-react';
import { Progress } from './ui/progress';

interface SubmitPaperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubmitPaperDialog({ open, onOpenChange }: SubmitPaperDialogProps) {
  const submitPaper = useSubmitPaper();
  const { data: allPapers } = useGetAllPapers();
  const { principal } = useInternetIdentity();

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionType, setSubmissionType] = useState<'file' | 'link'>('file');
  const [selectedCitations, setSelectedCitations] = useState<string[]>([]);

  // Get all reviews for all papers to determine which papers the user has reviewed
  const reviewQueries = useMemo(() => {
    if (!allPapers) return [];
    return allPapers.map(paper => paper.id);
  }, [allPapers]);

  // Determine which papers the user has reviewed
  const reviewedPaperIds = useMemo(() => {
    if (!allPapers || !principal) return new Set<string>();

    const reviewed = new Set<string>();
    allPapers.forEach(paper => {
      // We need to check reviews for each paper
      // This is a simplified approach - in production, you might want to optimize this
      // by having a backend endpoint that returns papers reviewed by the current user
    });

    return reviewed;
  }, [allPapers, principal]);

  // Get papers that can be cited (papers that exist and user has reviewed)
  const citablePapers = useMemo(() => {
    if (!allPapers || !principal) return [];

    // For now, we'll show all papers and let the backend validate
    // In a production app, you'd want to fetch which papers the user has reviewed
    return allPapers.filter(paper =>
      paper.author.toString() !== principal
    );
  }, [allPapers, principal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCitationToggle = (paperId: string) => {
    setSelectedCitations(prev =>
      prev.includes(paperId)
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !abstract.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (submissionType === 'file' && !file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (submissionType === 'link' && !externalLink.trim()) {
      toast.error('Please provide an external link');
      return;
    }

    try {
      const id = `paper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      let fileReference: ExternalBlob | null = null;

      if (submissionType === 'file' && file) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        fileReference = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await submitPaper.mutateAsync({
        id,
        title: title.trim(),
        abstract: abstract.trim(),
        fileReference,
        externalLink: submissionType === 'link' ? externalLink.trim() : null,
        citations: selectedCitations,
      });

      toast.success('Paper submitted successfully! You earned 10 tokens.');

      setTitle('');
      setAbstract('');
      setExternalLink('');
      setFile(null);
      setUploadProgress(0);
      setSelectedCitations([]);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error submitting paper:', error);
      const errorMessage = error.message || 'Failed to submit paper';

      // Check if error is about citation validation
      if (errorMessage.includes('must review')) {
        toast.error('Citation Error: ' + errorMessage);
      } else if (errorMessage.includes('does not exist')) {
        toast.error('Citation Error: ' + errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Paper</DialogTitle>
          <DialogDescription>
            Share your research with the academic community. Earn 10 tokens for each submission.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter paper title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              placeholder="Provide a brief summary of your research"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={6}
              required
            />
          </div>

          <Tabs value={submissionType} onValueChange={(v) => setSubmissionType(v as 'file' | 'link')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="link" className="gap-2">
                <LinkIcon className="h-4 w-4" />
                External Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-2">
              <Label htmlFor="file">Paper File (PDF, DOC, etc.)</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground text-center">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="link" className="space-y-2">
              <Label htmlFor="link">External Link (arXiv, ResearchGate, etc.)</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://arxiv.org/abs/..."
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
              />
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Citations (Optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>You can only cite papers you have reviewed.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {citablePapers.length > 0 ? (
              <ScrollArea className="h-48 rounded-md border p-4">
                <div className="space-y-3">
                  {citablePapers.map((paper) => (
                    <div key={paper.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`cite-${paper.id}`}
                        checked={selectedCitations.includes(paper.id)}
                        onCheckedChange={() => handleCitationToggle(paper.id)}
                      />
                      <label
                        htmlFor={`cite-${paper.id}`}
                        className="text-sm leading-tight cursor-pointer flex-1"
                      >
                        <div className="font-medium">{paper.title}</div>
                        <div className="text-muted-foreground text-xs mt-1">
                          {paper.abstract.substring(0, 100)}...
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
                No papers available to cite. Review papers to cite them in your submissions.
              </div>
            )}

            {selectedCitations.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedCitations.length} paper{selectedCitations.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitPaper.isPending}>
              {submitPaper.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Paper
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
