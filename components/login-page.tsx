"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginPage() {
  const handleGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile https://www.googleapis.com/auth/spreadsheets",
      access_type: "offline",
      prompt: "consent"
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">Inventario</CardTitle>
          <CardDescription>Inicia sesión para acceder al sistema de inventario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button onClick={handleGoogleLogin} className="w-full bg-white border rounded px-4 py-2 flex items-center justify-center gap-2">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-5 w-5" />
            Iniciar sesión con Google
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
