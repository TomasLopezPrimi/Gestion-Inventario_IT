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
  const [tokenClient, setTokenClient] = useState<any>(null);

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
      setTokenClient(client);
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
    // Esta es tu función
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

  return {
    user,
    isLoading,
    error,
    signIn,
    signOut,
  };
}



// import { useState, useEffect } from "react"

// interface GoogleUser {
//   email: string
//   name: string
//   picture: string
//   accessToken: string
// }

// export function useGoogleAuth() {
//   const [user, setUser] = useState<GoogleUser | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)


//   // Cargar el script de Google
//   useEffect(() => {
//     const loadGoogleScript = () => {
//       const script = document.createElement("script")
//       script.src = "https://accounts.google.com/gsi/client"
//       script.async = true
//       script.defer = true
//       document.body.appendChild(script)

//       return () => {
//         document.body.removeChild(script)
//       }
//     }

//     loadGoogleScript()
//   }, [])

//   const initializeGoogleAuth = () => {
//     if (!window.google) {
//       setError("Google API no está disponible")
//       return
//     }

//     try {
//       window.google.accounts.id.initialize({
//         client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//         callback: handleCredentialResponse,
//         auto_select: false,
//         cancel_on_tap_outside: true,
//       })

//       // Renderizar el botón de Google
//       window.google.accounts.id.renderButton(
//         document.getElementById("googleButton")!,
//         { 
//           theme: "outline",
//           size: "large",
//           text: "signin_with",
//           shape: "rectangular",
//           // width: 300, // Puedes ajustar el ancho si lo deseas
//         }
//       )
//     } catch (err) {
//       setError("Error al inicializar Google Auth")
//       console.error(err)
//     }
//   }

//   const handleCredentialResponse = async (response: any) => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       // Decodificar el token JWT
//       const payload = JSON.parse(atob(response.credential.split(".")[1]))
      
//       // Obtener el token de acceso
//       const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           code: response.credential,
//           client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//           client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
//           redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
//           grant_type: "authorization_code",
//         }),
//       })

//       const tokenData = await tokenResponse.json()

//       if (!tokenResponse.ok) {
//         throw new Error(tokenData.error || "Error al obtener el token de acceso")
//       }

//       const userData: GoogleUser = {
//         email: payload.email,
//         name: payload.name,
//         picture: payload.picture,
//         accessToken: tokenData.access_token,
//       }

//       // Guardar en localStorage
//       localStorage.setItem("googleUser", JSON.stringify(userData))
//       localStorage.setItem("googleAccessToken", tokenData.access_token)

//       setUser(userData)
//       setError(null)
//     } catch (err) {
//       setError("Error al procesar la autenticación")
//       console.error(err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const signOut = () => {
//     localStorage.removeItem("googleUser")
//     localStorage.removeItem("googleAccessToken")
//     setUser(null)
//     window.google?.accounts.id.disableAutoSelect()
//   }

//   useEffect(() => {
//     // Verificar si hay un usuario guardado
//     const savedUser = localStorage.getItem("googleUser")
//     const savedToken = localStorage.getItem("googleAccessToken")

//     if (savedUser && savedToken) {
//       setUser({
//         ...JSON.parse(savedUser),
//         accessToken: savedToken,
//       })
//     }

//     setIsLoading(false)
//   }, [])

//   return {
//     user,
//     isLoading,
//     error,
//     initializeGoogleAuth,
//     signOut,
//   }
// } 

