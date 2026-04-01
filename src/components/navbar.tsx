'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Menu, X, ScanLine } from 'lucide-react';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Cómo Funciona', href: '#como-funciona' },
  { label: 'Subir', href: '#subir' },
  { label: 'Experiencias', href: '#experiencias' },
  { label: 'Académico', href: '#academico' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="#inicio" className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg">
            <Image
              src="/logo.png"
              alt="InmérgeteAR Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary">
            InmérgeteAR
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" className="ml-2 gap-1.5">
            <ScanLine className="h-4 w-4" />
            Escanear QR
          </Button>
        </div>

        {/* Mobile Nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="flex items-center gap-2 px-2">
              <div className="relative h-7 w-7 overflow-hidden rounded-lg">
                <Image
                  src="/logo.png"
                  alt="InmérgeteAR Logo"
                  fill
                  className="object-cover"
                />
              </div>
              InmérgeteAR
            </SheetTitle>
            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 px-3">
                <Button className="w-full gap-1.5">
                  <ScanLine className="h-4 w-4" />
                  Escanear QR
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
