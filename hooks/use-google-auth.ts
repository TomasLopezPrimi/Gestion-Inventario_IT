import { useState, useEffect } from "react"

interface GoogleUser {
  email: string
  name: string
  picture: string
  accessToken: string
}

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  // Cargar el script de Google
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }

    loadGoogleScript()
  }, [])

  const initializeGoogleAuth = () => {
    if (!window.google) {
      setError("Google API no está disponible")
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      // Renderizar el botón de Google
      window.google.accounts.id.renderButton(
        document.getElementById("googleButton")!,
        { 
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          // width: 300, // Puedes ajustar el ancho si lo deseas
        }
      )
    } catch (err) {
      setError("Error al inicializar Google Auth")
      console.error(err)
    }
  }

  const handleCredentialResponse = async (response: any) => {
    try {
      setIsLoading(true)
      setError(null)

      // Decodificar el token JWT
      const payload = JSON.parse(atob(response.credential.split(".")[1]))
      
      // Obtener el token de acceso
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: response.credential,
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
          redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
          grant_type: "authorization_code",
        }),
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error || "Error al obtener el token de acceso")
      }

      const userData: GoogleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        accessToken: tokenData.access_token,
      }

      // Guardar en localStorage
      localStorage.setItem("googleUser", JSON.stringify(userData))
      localStorage.setItem("googleAccessToken", tokenData.access_token)

      setUser(userData)
      setError(null)
    } catch (err) {
      setError("Error al procesar la autenticación")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem("googleUser")
    localStorage.removeItem("googleAccessToken")
    setUser(null)
    window.google?.accounts.id.disableAutoSelect()
  }

  useEffect(() => {
    // Verificar si hay un usuario guardado
    const savedUser = localStorage.getItem("googleUser")
    const savedToken = localStorage.getItem("googleAccessToken")

    if (savedUser && savedToken) {
      setUser({
        ...JSON.parse(savedUser),
        accessToken: savedToken,
      })
    }

    setIsLoading(false)
  }, [])

  return {
    user,
    isLoading,
    error,
    initializeGoogleAuth,
    signOut,
  }
} 