import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, FileText, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: { email: string; password: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin(formData);
      toast.success('Welcome back! Loading your document workspace...');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-red-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="relative vodafone-gradient p-3 rounded-2xl vodafone-shadow">
              <FileText className="h-8 w-8 text-white" />
              <Sparkles className="h-4 w-4 text-white absolute -top-1 -right-1 bg-orange-500 rounded-full p-0.5" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Document Management Tool Kit</h1>
            <p className="text-gray-600 text-center max-w-sm mx-auto leading-relaxed">
              Your central hub for organising, accessing, and collaborating on documents securely and efficiently. 
              Streamline workflows, ensure version control, and empower your team with smart search and sharing 
              capabilities—all in one place.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-gray-200 shadow-xl hover-lift bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">Welcome back</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Sign in to access your document workspace
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full vodafone-gradient hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Features Preview */}
            <div className="pt-4 space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">What you'll get access to:</p>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>10+ specialized document agents</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Interactive document workflows</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Custom agent creation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Need help accessing your workspace?{' '}
          <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
            Contact support
          </Button>
        </p>
      </div>
    </div>
  );
}