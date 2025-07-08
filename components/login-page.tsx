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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      <img 
        src="https://wearesolu.com/wp-content/uploads/2024/07/Marca-solor.svg"
        width={"400px"}
        height={"100%"}
        alt={"logo solu"}
      />

      <Card className="w-full max-w-md  p-4 border border-gray-200 rounded shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">Solu Inventario</CardTitle>
          <CardDescription>Inicia sesión para acceder a la App del inventario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button onClick={handleGoogleLogin} className="w-full bg-white-300 text-slate-800 text-center border rounded px-4 py-2 flex items-center justify-center gap-2">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-5 w-5" />
            Iniciar sesión con Google
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
