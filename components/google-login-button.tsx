"use client"

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"

interface GoogleLoginButtonProps {
  onClick: () => void
  isLoading?: boolean
}

export function GoogleLoginButton({ onClick, isLoading }: GoogleLoginButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      ) : (
        <FcGoogle className="h-5 w-5" />
      )}
      {isLoading ? "Iniciando sesión..." : "Continuar con Google"}
    </Button>
  )
} 