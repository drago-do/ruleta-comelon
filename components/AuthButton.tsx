"use client";

import { signIn, signOut, useSession } from "@/lib/auth-client";
import { useState } from "react";
import Image from "next/image";

export default function AuthButton() {
  const { data: session, isPending } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-black shadow-[2px_2px_0_#000]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-bold">Cargando...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <button
        onClick={handleSignIn}
        className="bg-white hover:bg-gray-100 text-black font-black px-6 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider text-sm sm:text-base flex items-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Iniciar con Google
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-white hover:bg-gray-100 text-black font-black px-4 py-2 rounded-full border-4 border-black shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] transition-all flex items-center gap-3"
      >
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="rounded-full border-2 border-black"
          />
        )}
        <div className="text-left hidden sm:block">
          <div className="text-sm leading-tight">{session.user.name}</div>
          <div className="text-xs text-gray-600 leading-tight">
            {session.user.email}
          </div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white border-4 border-black shadow-[6px_6px_0_#000] rounded-2xl overflow-hidden z-20">
            <div className="p-4 border-b-4 border-black bg-yellow-200">
              <div className="text-sm font-black text-red-900 uppercase">
                Requests Hoy
              </div>
              <div className="text-2xl font-black text-red-600">? / 5</div>
              <div className="text-xs text-gray-700 mt-1">
                Resetea a medianoche
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 hover:bg-red-100 font-black text-red-600 uppercase tracking-wider text-sm transition-colors"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}
