import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Salasanat eivät täsmää",
        description: "Tarkista, että salasanat ovat samat.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Salasana liian lyhyt",
        description: "Salasanan tulee olla vähintään 6 merkkiä.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: { email, password, setupCode },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setIsSuccess(true);
      toast({
        title: "Admin-tili luotu!",
        description: "Voit nyt kirjautua sisään ylläpitosivulle.",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/yllapito");
      }, 2000);

    } catch (error: any) {
      console.error("Setup error:", error);
      toast({
        variant: "destructive",
        title: "Virhe tilin luonnissa",
        description: error.message || "Jokin meni pieleen. Yritä uudelleen.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
        <Card className="w-full max-w-md shadow-elevated text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-serif mb-2">Tili luotu onnistuneesti!</h2>
            <p className="text-muted-foreground">Sinut ohjataan kirjautumissivulle...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Admin-tilin luonti</CardTitle>
          <CardDescription>
            Luo ylläpitäjätili varausten hallintaan. Tämä on kertaluontoinen asetus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="setupCode">Asennuskoodi</Label>
              <Input
                id="setupCode"
                type="password"
                placeholder="Syötä asennuskoodi"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Asennuskoodi on: SALON2024ADMIN
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Sähköposti</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Salasana</Label>
              <Input
                id="password"
                type="password"
                placeholder="Vähintään 6 merkkiä"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Vahvista salasana</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Syötä salasana uudelleen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="gold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Luodaan tiliä...
                </>
              ) : (
                "Luo admin-tili"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
