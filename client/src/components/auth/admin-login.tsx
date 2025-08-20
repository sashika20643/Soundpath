
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, User } from 'lucide-react';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome, Admin!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login",
      });
    }
    
    setIsLoading(false);
    setPassword('');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--color-warm-white)" }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-serif">
            <Lock className="w-6 h-6" style={{ color: "var(--color-charcoal)" }} />
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Enter your admin credentials to access the dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
