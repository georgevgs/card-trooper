import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard } from 'lucide-react';

interface WelcomePageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onLogin, onRegister }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin(email, password);
      setIsAuthOpen(false); // Close the modal on successful login
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onRegister(username, email, password);
      setIsAuthOpen(false); // Close the modal on successful registration
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0B132B] via-[#3A506B] to-[#5BC0BE] text-white flex flex-col">
      <div className="flex-grow flex flex-col p-6 sm:p-8">
        <header className="flex justify-between items-center mb-auto">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-8 h-8 text-[#6FFFE9]" />
            <h1 className="text-2xl font-bold">Card Trooper</h1>
          </div>
          <Button
            onClick={() => setIsAuthOpen(true)}
            className="bg-[#5BC0BE] hover:bg-[#6FFFE9] hover:text-[#0B132B] text-white transition-colors"
          >
            Login
          </Button>
        </header>

        <main className="flex-grow flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Manage Your Cards<br />With Ease
          </h2>
          <p className="text-xl mb-8 max-w-2xl">
            Keep all your store cards in one secure place. Access them anytime, anywhere.
          </p>
          <Button
            size="lg"
            onClick={() => setIsAuthOpen(true)}
            className="bg-[#6FFFE9] hover:bg-[#5BC0BE] text-[#0B132B] hover:text-white font-bold px-8 py-3 text-lg transition-colors"
          >
            Get Started
          </Button>
        </main>

        <footer className="mt-auto text-center text-sm opacity-70">
          © 2024 Card Trooper. All rights reserved.
        </footer>
      </div>

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-[425px] mx-auto w-[calc(100%-2rem)] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Account Access</DialogTitle>
            <DialogDescription>
              Login or create a new account to get started.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WelcomePage;