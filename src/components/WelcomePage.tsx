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
  onLogin: () => void;
}

const WelcomePage = ({ onLogin }: WelcomePageProps) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
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
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
                <Button type="submit" className="w-full">Sign Up</Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WelcomePage;