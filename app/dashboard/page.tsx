"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("googleUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) {
    return <div className="p-8">No hay usuario autenticado.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">¡Bienvenido, {user.name}!</h1>
      <img src={user.picture} alt={user.name} className="rounded-full w-24 h-24 mb-4" />
      <p><b>Email:</b> {user.email}</p>
    </div>
  );
} 