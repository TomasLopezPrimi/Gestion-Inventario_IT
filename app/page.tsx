"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { LoginPage } from "@/components/login-page"

interface User {
  email: string;
  name: string;
  picture?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("googleUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("googleUser");
    localStorage.removeItem("googleAccessToken");
    setUser(null);
  };

  if (loading) {
    return <div className="p-8">Cargando...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AppLayout user={user} onLogout={handleLogout} />;
}
