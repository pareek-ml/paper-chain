import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { BookOpen, User, Home, Coins } from 'lucide-react';
import type { View } from '../App';
import { Avatar, AvatarFallback } from './ui/avatar';

interface HeaderProps {
  currentView: View;
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export default function Header({ currentView, onNavigateHome, onNavigateDashboard }: HeaderProps) {
  const { login, logout, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = false;
  const buttonText = isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout();
      queryClient.clear();
      onNavigateHome();
    } else {
      await login();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/generated/academic-logo-transparent.dim_200x200.png"
              alt="Academic Publishing"
              className="h-10 w-10"
            />
            <div className="flex flex-col items-start">
              <span className="font-bold text-lg leading-none">AcademicChain</span>
              <span className="text-xs text-muted-foreground">Decentralized Publishing</span>
            </div>
          </button>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={onNavigateHome}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Papers
              </Button>
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={onNavigateDashboard}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Dashboard
              </Button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-accent/50">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {userProfile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{userProfile.name}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  {userProfile.tokenBalance.toString()} tokens
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </header>
  );
}
