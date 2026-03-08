import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        if (session) navigate('/');
      });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedIdentifier = identifier.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // Demo login
      if (trimmedIdentifier === 'demo@studyplanner.com' || trimmedIdentifier === 'demo') {
        localStorage.setItem('demo_user', 'true');

        toast({
          title: 'Welcome back!',
          description: 'Successfully logged into demo account.',
        });

        navigate('/');
        setTimeout(() => window.location.reload(), 100);
        return;
      }

      const authEmail = trimmedIdentifier.includes('@')
        ? trimmedIdentifier
        : `${trimmedIdentifier}@user.studyplanner.com`;

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: trimmedPassword,
        });

        if (error) throw error;

        toast({
          title: 'Welcome back!',
          description: 'Successfully logged into your study planner.',
        });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: trimmedPassword,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.user && !data.session) {
          toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account.',
          });
        } else {
          toast({
            title: 'Account created!',
            description: 'Your study planner is ready.',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <SEOHead
        title={isLogin ? 'Sign In - Study Planner' : 'Sign Up - Study Planner'}
        description="Login to manage your study sessions and track progress."
      />

      <div className="w-full max-w-md p-8 glass-card rounded-3xl border border-white/20 shadow-xl space-y-8 animate-fade-in">

        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? 'Sign in to access your planner'
              : 'Create a new account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <Input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>

        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;