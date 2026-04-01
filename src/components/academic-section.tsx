'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  FlaskConical,
  Landmark,
  Palette,
  Calculator,
  GraduationCap,
  BookOpen,
  Microscope,
  Users,
} from 'lucide-react';

const useCases = [
  {
    icon: FlaskConical,
    title: 'Ciencias',
    subtitle: 'Biología y Química',
    description:
      'Explora moléculas 3D, células y reacciones químicas de forma interactiva. Los estudiantes pueden visualizar conceptos complejos como si estuvieran dentro de un laboratorio virtual.',
    features: [
      'Visualización de estructuras moleculares',
      'Simulaciones de laboratorio 360°',
      'Anatomía interactiva',
    ],
    iconColor: 'text-emerald-600 bg-emerald-500/10',
  },
  {
    icon: Landmark,
    title: 'Historia',
    subtitle: 'Museos y Arqueología',
    description:
      'Recorre sitios arqueológicos, museos y monumentos históricos sin salir del aula. Viaja en el tiempo con reconstrucciones inmersivas de civilizaciones pasadas.',
    features: [
      'Tours virtuales de museos',
      'Reconstrucciones históricas',
      'Análisis de artefactos en 360°',
    ],
    iconColor: 'text-amber-600 bg-amber-500/10',
  },
  {
    icon: Palette,
    title: 'Arte',
    subtitle: 'Galerías Virtuales',
    description:
      'Crea galerías de arte inmersivas donde los estudiantes pueden explorar obras maestras, técnicas pictóricas y movimientos artísticos en un entorno tridimensional.',
    features: [
      'Galerías de arte inmersivas',
      'Análisis de técnicas pictóricas',
      'Exposiciones virtuales interactivas',
    ],
    iconColor: 'text-purple-600 bg-purple-500/10',
  },
  {
    icon: Calculator,
    title: 'Matemáticas',
    subtitle: 'Geometría 3D',
    description:
      'Visualiza figuras geométricas, funciones y conceptos matemáticos abstractos en tres dimensiones. Facilita la comprensión espacial y el aprendizaje significativo.',
    features: [
      'Figuras geométricas interactivas',
      'Gráficos 3D de funciones',
      'Visualización espacial avanzada',
    ],
    iconColor: 'text-teal-600 bg-teal-500/10',
  },
];

const stats = [
  { icon: GraduationCap, value: 'Mejor retención', label: 'Estudiantes recuerdan hasta un 80% más con experiencias inmersivas' },
  { icon: BookOpen, value: 'Aprendizaje activo', label: 'Participación estudiantil aumentada significativamente' },
  { icon: Microscope, value: 'Investigación', label: 'Herramienta para investigación educativa basada en evidencia' },
  { icon: Users, value: 'Accesibilidad', label: 'Acceso universal desde cualquier dispositivo con QR' },
];

export default function AcademicSection() {
  return (
    <section id="academico" className="py-20 sm:py-28 bg-muted/30">
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
            Uso Académico
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Transformando la Educación con Tecnología Inmersiva
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
            Descubre cómo InmérgeteAR está revolucionando el aprendizaje en
            diferentes disciplinas académicas.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card className="group h-full border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${useCase.iconColor} transition-transform group-hover:scale-110`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{useCase.title}</h3>
                        <p className="text-sm font-medium text-primary">
                          {useCase.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {useCase.description}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {useCase.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section with Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 overflow-hidden rounded-2xl border border-border/50 bg-card"
        >
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square md:aspect-auto md:min-h-[400px]">
              <Image
                src="/experience-360.png"
                alt="Experiencia académica inmersiva"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 md:bg-gradient-to-r md:from-transparent md:to-card" />
            </div>

            {/* Stats */}
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold">
                Evidencia Científica
              </h3>
              <p className="mt-2 text-muted-foreground">
                La investigación educativa respalda el uso de tecnologías
                inmersivas para mejorar los resultados de aprendizaje.
              </p>

              <div className="mt-8 space-y-6">
                {stats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <StatIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{stat.value}</h4>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
