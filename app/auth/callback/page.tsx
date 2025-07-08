"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) {
      console.log("No se encontró el parámetro code en la URL");
      return;
    }

    const fetchToken = async () => {
      try {
        const params = new URLSearchParams({
          code,
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
          redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
          grant_type: "authorization_code",
        });

        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });

        const data = await res.json();
        // console.log("Respuesta de Google:", data);

        if (!res.ok) throw new Error(data.error || "Error al obtener el token");

        if (!data.id_token) {
          throw new Error("No se recibió id_token en la respuesta");
        }

        // Guarda el token y el usuario
        localStorage.setItem("googleAccessToken", data.access_token);
        const user = JSON.parse(atob(data.id_token.split(".")[1]));
        //console.log("Guardando usuario en localStorage:", user);
        localStorage.setItem("googleUser", JSON.stringify(user));

        window.location.href = "/";
      } catch (err: any) {
        setError(err.message);
        console.error("Error en el callback:", err);
      }
    };

    fetchToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <div>Procesando autenticación...</div>
      )}
    </div>
  );
} 