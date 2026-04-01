'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  QrCode,
  Trash2,
  ImageIcon,
  Loader2,
  X,
  Download,
} from 'lucide-react';
import Image from 'next/image';

interface Experience {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  type: string;
  category: string;
  qrCodeUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

interface ExperiencesGalleryProps {
  onViewExperience: (experience: Experience) => void;
  refreshKey: number;
}

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'ciencias', label: 'Ciencias' },
  { value: 'historia', label: 'Historia' },
  { value: 'arte', label: 'Arte' },
  { value: 'matematicas', label: 'Matemáticas' },
  { value: 'general', label: 'General' },
];

const typeLabels: Record<string, string> = {
  '360': '360°',
  ar: 'Realidad Aumentada',
  vr: 'Realidad Virtual',
};

const categoryLabels: Record<string, string> = {
  ciencias: 'Ciencias',
  historia: 'Historia',
  arte: 'Arte',
  matematicas: 'Matemáticas',
  general: 'General',
};

const typeColors: Record<string, string> = {
  '360': 'bg-primary/10 text-primary border-primary/20',
  ar: 'bg-accent/10 text-accent-foreground border-accent/20',
  vr: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
};

export default function ExperiencesGallery({
  onViewExperience,
  refreshKey,
}: ExperiencesGalleryProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showQr, setShowQr] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, [refreshKey]);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experiences');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setExperiences((prev) => prev.filter((exp) => exp.id !== id));
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const filteredExperiences =
    activeCategory === 'all'
      ? experiences
      : experiences.filter((exp) => exp.category === activeCategory);

  const handleDownloadQr = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-${title}.png`;
    link.click();
  };

  return (
    <section id="experiencias" className="py-20 sm:py-28">
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
            Galería
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Experiencias Inmersivas
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
            Explora las experiencias creadas por la comunidad académica.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Cargando experiencias...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredExperiences.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 py-16 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No hay experiencias</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {experiences.length === 0
                  ? 'Aún no se ha creado ninguna experiencia. ¡Sube tu primera foto!'
                  : 'No hay experiencias en esta categoría.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Gallery Grid */}
        {!loading && filteredExperiences.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExperiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  {/* Image */}
                  <div
                    className="relative aspect-video cursor-pointer overflow-hidden"
                    onClick={() => onViewExperience(experience)}
                  >
                    <img
                      src={experience.imageUrl}
                      alt={experience.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-all group-hover:opacity-100">
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      <Badge
                        variant="outline"
                        className={typeColors[experience.type] || 'bg-muted text-muted-foreground'}
                      >
                        {typeLabels[experience.type] || experience.type}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold leading-tight line-clamp-1">
                      {experience.title}
                    </h3>
                    {experience.description && (
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                        {experience.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabels[experience.category] || experience.category}
                      </Badge>
                      <div className="flex gap-1">
                        {experience.qrCodeUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setShowQr(
                                showQr === experience.id
                                  ? null
                                  : experience.id
                              )
                            }
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(experience.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* QR Code Popup */}
                    {showQr === experience.id && experience.qrCodeUrl && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 p-4"
                      >
                        <img
                          src={experience.qrCodeUrl}
                          alt="Código QR"
                          className="h-28 w-28 rounded-md bg-white p-1 object-contain"
                        />
                        <p className="text-xs text-muted-foreground">
                          Escanea para ver la experiencia
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() =>
                            handleDownloadQr(
                              experience.qrCodeUrl!,
                              experience.title
                            )
                          }
                        >
                          <Download className="h-3 w-3" />
                          Descargar QR
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
