import { useState } from 'react';
import { useGetPaper, useGetReviewsForPaper, useGetAllPapers } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';
import { ArrowLeft, Calendar, Star, ExternalLink, FileText, Download, MessageSquare, FileCheck } from 'lucide-react';
import SubmitReviewDialog from './SubmitReviewDialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import type { Paper } from '../backend';

interface PaperDetailProps {
  paperId: string;
  onBack: () => void;
  onNavigateToPaper?: (paperId: string) => void;
}

export default function PaperDetail({ paperId, onBack, onNavigateToPaper }: PaperDetailProps) {
  const { data: paper, isLoading: paperLoading } = useGetPaper(paperId);
  const { data: reviews, isLoading: reviewsLoading } = useGetReviewsForPaper(paperId);
  const { data: allPapers } = useGetAllPapers();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isAuthor = paper && identity && paper.author.toString() === identity.getPrincipal().toString();
  const hasReviewed = reviews?.some(r => identity && r.reviewer.toString() === identity.getPrincipal().toString());

  // Get cited papers details with proper type narrowing
  const citedPapers: Paper[] = paper?.citations
    .map(citationId => allPapers?.find(p => p.id === citationId))
    .filter((p): p is Paper => p !== undefined) || [];

  const handleDownload = async () => {
    if (paper?.fileReference) {
      try {
        const bytes = await paper.fileReference.getBytes();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paper.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };

  const handleCitedPaperClick = (citedPaperId: string) => {
    if (onNavigateToPaper) {
      onNavigateToPaper(citedPaperId);
    }
  };

  if (paperLoading) {
    return (
      <div className="container py-12 space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="container py-12">
        <Card className="p-12">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold">Paper not found</h3>
            <Button onClick={onBack}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 space-y-8">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Papers
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-3xl">{paper.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(paper.submissionDate)}
                </div>
                {paper.aggregateRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    {paper.aggregateRating.toFixed(2)} ({Number(paper.reviewCount)} reviews)
                  </div>
                )}
              </div>
            </div>
            
            {paper.aggregateRating > 0 && (
              <Badge variant="secondary" className="text-lg px-4 py-2 gap-2">
                <Star className="h-5 w-5 fill-current" />
                {paper.aggregateRating.toFixed(1)}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Abstract</h3>
            <p className="text-muted-foreground leading-relaxed">{paper.abstract}</p>
          </div>

          {citedPapers.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Cited Papers ({citedPapers.length})
              </h3>
              <div className="space-y-2">
                {citedPapers.map((citedPaper) => (
                  <Card 
                    key={citedPaper.id} 
                    className="hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleCitedPaperClick(citedPaper.id)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base mb-1">{citedPaper.title}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            {citedPaper.abstract}
                          </CardDescription>
                        </div>
                        {citedPaper.aggregateRating > 0 && (
                          <Badge variant="secondary" className="gap-1 shrink-0">
                            <Star className="h-3 w-3 fill-current" />
                            {citedPaper.aggregateRating.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {paper.fileReference && (
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Paper
              </Button>
            )}
            
            {paper.externalLink && (
              <Button asChild variant="outline" className="gap-2">
                <a href={paper.externalLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View External Link
                </a>
              </Button>
            )}
            
            {isAuthenticated && !isAuthor && !hasReviewed && (
              <Button onClick={() => setShowReviewDialog(true)} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Submit Review
              </Button>
            )}
          </div>

          {isAuthor && (
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> You are the author of this paper and cannot review it.
              </p>
            </div>
          )}

          {hasReviewed && (
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> You have already submitted a review for this paper.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Reviews ({reviews?.length || 0})</h2>
        </div>

        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          R
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">Reviewer</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(review.submissionDate)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {Number(review.rating)}/5
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {review.feedback}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-3">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">No reviews yet</h3>
              <p className="text-muted-foreground">
                Be the first to review this paper and earn tokens!
              </p>
            </div>
          </Card>
        )}
      </div>

      <SubmitReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        paperId={paperId}
      />
    </div>
  );
}
