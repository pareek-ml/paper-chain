import { useState } from 'react';
import { useGetAllPapers } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Plus, Search, Star, Calendar, User, ExternalLink, FileText } from 'lucide-react';
import SubmitPaperDialog from './SubmitPaperDialog';
import type { Paper } from '../backend';

interface PaperListProps {
  onViewPaper: (paperId: string) => void;
}

export default function PaperList({ onViewPaper }: PaperListProps) {
  const { data: papers, isLoading } = useGetAllPapers();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  const filteredPapers = papers?.filter(paper => 
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const sortedPapers = [...filteredPapers].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.aggregateRating - a.aggregateRating;
    }
    return Number(b.submissionDate - a.submissionDate);
  });

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <section className="container py-12">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Published Papers</h2>
            <p className="text-muted-foreground">Browse and review academic research</p>
          </div>
          
          {isAuthenticated && (
            <Button onClick={() => setShowSubmitDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Submit Paper
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search papers by title or abstract..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'recent' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              Recent
            </Button>
            <Button
              variant={sortBy === 'rating' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('rating')}
            >
              Top Rated
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedPapers.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-3">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">No papers found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search query' : 'Be the first to submit a paper!'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPapers.map((paper) => (
              <Card 
                key={paper.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onViewPaper(paper.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {paper.title}
                    </CardTitle>
                    {paper.aggregateRating > 0 && (
                      <Badge variant="secondary" className="shrink-0 gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {paper.aggregateRating.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-3">
                    {paper.abstract}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(paper.submissionDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {Number(paper.reviewCount)} reviews
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {paper.fileReference && (
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        File
                      </Badge>
                    )}
                    {paper.externalLink && (
                      <Badge variant="outline" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Link
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <SubmitPaperDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog} />
    </section>
  );
}
