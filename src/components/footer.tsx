import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

const footerLinks = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Cómo Funciona', href: '#como-funciona' },
      { label: 'Subir Foto', href: '#subir' },
      { label: 'Experiencias', href: '#experiencias' },
    ],
  },
  {
    title: 'Académico',
    links: [
      { label: 'Ciencias', href: '#academico' },
      { label: 'Historia', href: '#academico' },
      { label: 'Arte', href: '#academico' },
      { label: 'Matemáticas', href: '#academico' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Documentación', href: '#' },
      { label: 'Investigación', href: '#academico' },
      { label: 'Tutoriales', href: '#como-funciona' },
      { label: 'Contacto', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="relative h-9 w-9 overflow-hidden rounded-lg">
                <Image
                  src="/logo.png"
                  alt="InmérgeteAR Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-bold text-primary">InmérgeteAR</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Plataforma académica de Realidad Aumentada para crear experiencias
              inmersivas educativas. Transforma el aprendizaje con tecnología
              innovadora.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-border/50" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} InmérgeteAR. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Privacidad
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Términos
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
