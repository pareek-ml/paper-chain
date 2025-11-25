import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Loader2, User } from 'lucide-react';

export default function ProfileSetupModal() {
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        reputation: BigInt(0),
        tokenBalance: BigInt(0),
      });
      
      toast.success('Profile created successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to create profile');
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Welcome to AcademicChain</DialogTitle>
          <DialogDescription className="text-center">
            Let's set up your profile to get started
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              This name will be associated with your papers and reviews
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
