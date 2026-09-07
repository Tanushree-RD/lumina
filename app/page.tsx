import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <main className="flex max-w-2xl flex-col items-center gap-8">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Lumina
        </h1>

        <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
          Explainable AI for Trustworthy Exoplanet Discovery
        </p>

        <Button size="lg" className="mt-4">
          Launch Dashboard
        </Button>
      </main>
    </div>
  );
}
