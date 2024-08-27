import Link from "next/link";
import { PackageCheck } from "lucide-react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { UserAuthForm } from "@/components/authform";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
        <div className="container h-14 flex items-center">
          <Link
            href="/"
            className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
          >
            <PackageCheck className="w-6 h-6 mr-3" />
            <span className="font-bold">Shipments Tracker</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              Simplify Your Shipment Management
            </h1>
            <span className="max-w-[750px] text-center text-lg font-light text-foreground">
            </span>
            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
              <UserAuthForm />
            </div>
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Start Managing Shipments</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
          </section>
        </div>
      </main>
      <footer className="w-full py-6 bg-slate-100">
  <div className="container mx-auto px-4 flex items-center justify-between">
    <p className="text-sm text-gray-600">© 2024 Shipments Tracker.</p>
    <nav className="flex space-x-4">
      {/* Add any footer navigation links here if needed */}
    </nav>
  </div>
</footer>

    </div>
  );
}
