"use client"

import { useState, useEffect, useCallback } from "react"

interface GoogleUser {
  email: string
  name: string
  picture: string
}

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initializeTokenClient = useCallback(() => {
    if (window.google?.accounts?.oauth2) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/spreadsheets',
        ].join(' '),
        prompt: 'consent',
        callback: handleTokenResponse,
        error_callback: (error: any) => {
          console.error("Error de Google Auth:", error);
          setError("Error durante la autenticación con Google.");
        }
      });
    }
  }, []);

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.body.appendChild(script)
    
    script.onload = () => {
      initializeTokenClient();
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [initializeTokenClient])

const signIn = () => {
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

  const handleTokenResponse = async (tokenResponse: any) => {
    if (tokenResponse.error) {
        setError(tokenResponse.error_description);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = tokenResponse.access_token;
      localStorage.setItem("googleAccessToken", accessToken);

      const refreshToken = tokenResponse.refresh_token ? tokenResponse.refresh_token : null;
      refreshToken ? localStorage.setItem("googleRefreshToken", refreshToken) : null;

      const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profileData = await profileResponse.json();
      if (!profileResponse.ok) {
        throw new Error(profileData.error.message || "Error al obtener la información del perfil");
      }

      const userData: GoogleUser = {
        email: profileData.email,
        name: profileData.name,
        picture: profileData.picture,
      };

      localStorage.setItem("googleUser", JSON.stringify(userData));
      setUser(userData);
    } catch (err: any) {
      setError(err.message || "Error al procesar la autenticación");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    const accessToken = localStorage.getItem("googleAccessToken");
    if (accessToken) {
      window.google?.accounts?.oauth2?.revoke(accessToken, () => {
        console.log('Token revocado');
      });
    }
    localStorage.removeItem("googleUser");
    localStorage.removeItem("googleAccessToken");
    setUser(null);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("googleUser");
    const savedToken = localStorage.getItem("googleAccessToken");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("googleRefreshToken");
    if (!refreshToken) throw new Error("No hay refresh token disponible");
  
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });
  
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No se pudo refrescar el token");
  
    localStorage.setItem("googleAccessToken", data.access_token);
    return data.access_token;
  }

  return {
    user,
    isLoading,
    error,
    signIn,
    signOut,
    refreshAccessToken,
  };
}