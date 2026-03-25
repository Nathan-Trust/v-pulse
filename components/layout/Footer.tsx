import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
       

        <div className=" flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fusion Tech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
