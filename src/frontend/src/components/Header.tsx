import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tv, Shield } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  showAdminDashboard: boolean;
  onToggleDashboard: () => void;
}

export default function Header({ isAdmin, showAdminDashboard, onToggleDashboard }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/channel-logo-transparent.dim_200x200.png" 
            alt="Country Channel" 
            className="h-10 w-10"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">Country Channel</h1>
            <p className="text-xs text-muted-foreground">Your Home for Country Entertainment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              onClick={onToggleDashboard}
              variant={showAdminDashboard ? "default" : "outline"}
              size="sm"
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              {showAdminDashboard ? 'View Public' : 'Admin Dashboard'}
            </Button>
          )}
          
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? "outline" : "default"}
            size="sm"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </header>
  );
}
