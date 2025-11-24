import { BookOpen, Users, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="container relative py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Award className="h-4 w-4" />
              Decentralized Academic Publishing
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Publish. Review.
              <span className="block text-primary">Earn Rewards.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              A transparent, decentralized platform for academic publishing with peer review and token-based incentives. 
              Built on the Internet Computer for permanent, censorship-resistant research.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Submit Papers</div>
                  <div className="text-sm text-muted-foreground">Earn 10 tokens</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Peer Review</div>
                  <div className="text-sm text-muted-foreground">Earn 5 tokens</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Build Reputation</div>
                  <div className="text-sm text-muted-foreground">Quality matters</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/assets/generated/hero-academic-banner.dim_1200x400.png" 
              alt="Academic Publishing Platform" 
              className="rounded-lg shadow-2xl border border-border/40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
