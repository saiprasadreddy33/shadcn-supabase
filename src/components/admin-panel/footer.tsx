import Link from "next/link";

export function Footer() {
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 md:mx-8 flex h-14 items-center justify-end">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground">
          <span className="italic font-medium text-right underline underline-offset-4">
            Shipments Dashboard @2024
          </span>
        </p>
      </div>
    </div>
  );
}
