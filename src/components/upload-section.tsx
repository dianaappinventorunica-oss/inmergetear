'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadSectionProps {
  onExperienceCreated: () => void;
}

export default function UploadSection({ onExperienceCreated }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('360');
  const [category, setCategory] = useState('general');
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdQrCode, setCreatedQrCode] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Por favor, selecciona una imagen');
      return;
    }
    if (!title.trim()) {
      toast.error('Por favor, ingresa un título');
      return;
    }

    setIsUploading(true);
    setCreatedQrCode(null);

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      const uploadData = await uploadRes.json();

      // Create experience
      setIsUploading(false);
      setIsCreating(true);

      const experienceRes = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          imageUrl: uploadData.dataUrl,
          type,
          category,
        }),
      });

      if (!experienceRes.ok) {
        const errorData = await experienceRes.json();
        throw new Error(errorData.error || 'Error al crear la experiencia');
      }

      const experience = await experienceRes.json();

      toast.success('¡Experiencia creada exitosamente!', {
        description: 'Se ha generado un código QR para compartir.',
      });

      setCreatedQrCode(experience.qrCodeUrl);
      onExperienceCreated();

      // Reset form (keep QR code visible)
      setFile(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      setType('360');
      setCategory('general');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      toast.error('Error al crear la experiencia', {
        description: message,
      });
    } finally {
      setIsUploading(false);
      setIsCreating(false);
    }
  };

  return (
    <section id="subir" className="py-20 sm:py-28 bg-muted/30">
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
            Crear Experiencia
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Sube tu Foto
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
            Transforma cualquier imagen en una experiencia inmersiva. Arrastra y suelta
            tu foto para comenzar.
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 mx-auto max-w-2xl"
        >
          <Card className="border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dropzone */}
                {!preview ? (
                  <div
                    {...getRootProps()}
                    className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                      isDragActive
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Upload className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-base font-medium">
                          Arrastra tu imagen aquí
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          o haz clic para seleccionar · JPEG, PNG, WebP (max 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border border-border">
                    <div className="relative aspect-video">
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-white shadow-md transition-colors hover:bg-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Laboratorio de Química - Vista 360°"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe la experiencia inmersiva..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Type & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Experiencia</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="360">360°</SelectItem>
                        <SelectItem value="ar">Realidad Aumentada</SelectItem>
                        <SelectItem value="vr">Realidad Virtual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="ciencias">Ciencias</SelectItem>
                        <SelectItem value="historia">Historia</SelectItem>
                        <SelectItem value="arte">Arte</SelectItem>
                        <SelectItem value="matematicas">Matemáticas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full gap-2 bg-primary"
                  disabled={isUploading || isCreating}
                >
                  {(isUploading || isCreating) ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isUploading ? 'Subiendo imagen...' : 'Generando experiencia...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Crear Experiencia
                    </>
                  )}
                </Button>
              </form>

              {/* QR Code Result */}
              {createdQrCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-3 font-semibold">¡Código QR Generado!</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Comparte este código QR para que los estudiantes accedan a la experiencia.
                  </p>
                  <div className="mt-4 inline-block overflow-hidden rounded-lg border border-border bg-white p-2">
                    <img
                      src={createdQrCode}
                      alt="Código QR"
                      className="h-36 w-36 object-contain"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <QrCode className="h-3.5 w-3.5" />
                    Escanea para acceder a la experiencia
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
