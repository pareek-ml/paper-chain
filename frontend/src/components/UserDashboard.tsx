import { useGetCallerUserProfile, useGetAllPapers, useGetUserTokenBalance } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Coins, Award, FileText, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import type { Paper } from '../backend';

interface UserDashboardProps {
  onViewPaper: (paperId: string) => void;
}

export default function UserDashboard({ onViewPaper }: UserDashboardProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: allPapers, isLoading: papersLoading } = useGetAllPapers();
  const { data: tokenBalance, isLoading: balanceLoading } = useGetUserTokenBalance();

  const userPapers = allPapers?.filter(
    paper => identity && paper.author.toString() === identity.getPrincipal().toString()
  ) || [];

  const totalReviews = userPapers.reduce((sum, paper) => sum + Number(paper.reviewCount), 0);
  const avgRating = userPapers.length > 0
    ? userPapers.reduce((sum, paper) => sum + paper.aggregateRating, 0) / userPapers.length
    : 0;

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (profileLoading || papersLoading || balanceLoading) {
    return (
      <div className="container py-12 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userProfile?.name || 'Researcher'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tokenBalance?.toString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Earned from contributions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile?.reputation.toString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Quality score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Papers Published</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPapers.length}</div>
            <p className="text-xs text-muted-foreground">
              Total submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Received</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Peer feedback
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Papers</CardTitle>
          <CardDescription>
            Papers you've submitted to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userPapers.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">No papers yet</h3>
              <p className="text-muted-foreground">
                Submit your first paper to start earning tokens!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPapers.map((paper) => (
                <div
                  key={paper.id}
                  onClick={() => onViewPaper(paper.id)}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <h4 className="font-semibold hover:text-primary transition-colors">
                      {paper.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {paper.abstract}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(paper.submissionDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {Number(paper.reviewCount)} reviews
                      </div>
                      {paper.aggregateRating > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {paper.aggregateRating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
