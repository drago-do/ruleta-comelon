import HeroHeader from "@/components/HeroHeader";
import MenuProcessor from "@/components/MenuProcessor";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <div className="min-h-screen font-sans p-4 sm:p-8 flex flex-col items-center">
      {/* Auth Button - Esquina superior derecha */}
      <div className="fixed top-4 right-4 z-50 scale-90 sm:scale-100">
        <AuthButton />
      </div>

      <HeroHeader />

      <main className="w-full max-w-4xl flex flex-col items-center gap-6 sm:gap-12">
        <MenuProcessor />
      </main>
      <div className="w-full"></div>
    </div>
  );
}
