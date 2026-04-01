'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Upload, Sparkles, QrCode } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Sube tu Foto',
    description:
      'Selecciona o arrastra una imagen desde tu dispositivo. Aceptamos formatos JPEG, PNG y WebP de hasta 10MB.',
    image: '/ar-education.png',
  },
  {
    icon: Sparkles,
    title: 'Genera la Experiencia',
    description:
      'Configura el tipo de experiencia (360°, AR, VR) y la categoría académica. El sistema genera automáticamente la experiencia inmersiva.',
    image: '/experience-360.png',
  },
  {
    icon: QrCode,
    title: 'Escanea el QR',
    description:
      'Obtén un código QR único para compartir. Los estudiantes pueden acceder directamente desde su celular sin instalar nada.',
    image: '/qr-scan.png',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Proceso Simple
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Cómo Funciona?
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
            Tres pasos sencillos para crear y compartir experiencias inmersivas
            en el ámbito académico.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  {/* Step number */}
                  <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
                    {index + 1}
                  </div>
                  <CardContent className="p-6">
                    {/* Icon */}
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Image */}
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
