import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Server,
  Lock,
  ArrowRight,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setAuth } from "@/store/slices/authSlice";
import { signInMock, setStoredAuth } from "@/lib/mockAuth";
import { toggleTheme } from "@/store/slices/dashboardSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroImage from "@/assets/hero-dashboard.jpg";
import { ThemeProvider } from "next-themes";
import { navLogo } from "@/config/constants";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.dashboard.theme);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      setError(null);
      const auth = await signInMock(email, password);
      setStoredAuth(auth);
      dispatch(setAuth({ isAuthenticated: true, user: auth.user }));
      navigate("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme={theme} forcedTheme={theme}>
      <div className={`min-h-screen bg-background relative ${theme}`}>
        {/* Theme toggle */}
        <div className="absolute top-4 right-4 z-20">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(toggleTheme())}
              className="relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: theme === "dark" ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </motion.div>
            </Button>
          </motion.div>
        </div>
        {/* Gradient background accents */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-gold-gradient opacity-10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-primary/30 opacity-10 blur-3xl" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Hero panel */}
          <div className="hidden lg:flex relative items-center justify-center p-12">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gold-gradient opacity-10" />
            <div className="relative max-w-xl space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center space-x-3 rounded-full px-4 py-2 glass-card">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Modern IT Services Platform
                  </span>
                </div>
                <h1 className="text-4xl xl:text-5xl font-bold text-foreground">
                  Secure Access to
                  <span className="block text-transparent bg-clip-text bg-gold-gradient">
                    Xrt-tech Admin
                  </span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage users, plans, support, and analytics with
                  enterprise-grade security and performance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Shield, label: "Secure" },
                    { icon: Server, label: "Scalable" },
                    { icon: Lock, label: "SSO Ready" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="glass-card p-4 rounded-xl flex items-center space-x-3"
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Auth form */}
          <div className="flex items-center justify-center p-6 sm:p-10">
            <Card className="w-full max-w-md glass-card">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-center">
                  <div className="p-1.5 bg-gradient-to-br from-primary/10 to-transparent rounded-xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.3)]">
                    <img 
                      src={navLogo} 
                      alt="Xrt-tech" 
                      className="w-44 rounded-lg object-contain shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold text-foreground">
                    Welcome back
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sign in to manage your Xrt-tech dashboard
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="glass-card"
                      placeholder="you@xrt-tech.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="glass-card"
                      placeholder="••••••••"
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gold-gradient text-primary-foreground group"
                    disabled={submitting}
                  >
                    {submitting ? (
                      "Signing in..."
                    ) : (
                      <span className="inline-flex items-center">
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    By continuing you agree to our Terms and Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;
