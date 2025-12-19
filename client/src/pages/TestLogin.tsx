import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";

export default function TestLogin() {
  const [email, setEmail] = useState("test@fittracker.com");
  const [password, setPassword] = useState("test123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [_, setLocation] = useLocation();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/test-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      
      if (res.ok) {
        // Redirect to dashboard after successful login
        setTimeout(() => setLocation("/dashboard"), 500);
      } else {
        const data = await res.json();
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Test Login</h1>
          <p className="text-muted-foreground text-sm">Development only - Use credentials below</p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="test@fittracker.com"
              className="bg-white/5 border-white/10 h-12 rounded-xl"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="test123"
              className="bg-white/5 border-white/10 h-12 rounded-xl"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-primary text-black font-bold text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>

        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-muted-foreground">
            <strong>Test Credentials:</strong><br />
            Email: test@fittracker.com<br />
            Password: test123
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="w-full h-12 rounded-xl"
          disabled={isLoading}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}
