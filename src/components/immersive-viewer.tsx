'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  X,
  Share2,
  QrCode,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

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

interface ImmersiveViewerProps {
  experience: Experience | null;
  onClose: () => void;
}

export default function ImmersiveViewer({
  experience,
  onClose,
}: ImmersiveViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const deltaX = clientX - lastPos.current.x;
    const deltaY = clientY - lastPos.current.y;

    setRotation((prev) => ({
      x: Math.max(-45, Math.min(45, prev.x + deltaY * 0.2)),
      y: Math.max(-45, Math.min(45, prev.y - deltaX * 0.2)),
    }));

    lastPos.current = { x: clientX, y: clientY };
  }, []);

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    lastPos.current = { x: clientX, y: clientY };
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const resetView = () => {
    setScale(1);
    setRotation({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (experience) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [experience, onClose]);

  const handleShare = async () => {
    if (!experience) return;
    const url = `${window.location.origin}/#/experience/${experience.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Enlace copiado', {
        description: 'Pega el enlace para compartir la experiencia.',
      });
    } catch {
      toast.error('No se pudo copiar el enlace');
    }
  };

  if (!experience) return null;

  const typeLabels: Record<string, string> = {
    '360': '360°',
    ar: 'Realidad Aumentada',
    vr: 'Realidad Virtual',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Controls */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
          {experience.qrCodeUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              onClick={() => setShowQr(!showQr)}
            >
              <QrCode className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={resetView}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Image Area */}
        <div
          ref={containerRef}
          className="relative flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseDown={handlePointerDown}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchMove={handleMouseMove}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
        >
          <motion.div
            animate={{
              scale,
              rotateX: rotation.x,
              rotateY: rotation.y,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="relative"
            style={{ perspective: '1200px' }}
          >
            <div
              className="max-h-[80vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={experience.imageUrl}
                alt={experience.title}
                className="max-h-[80vh] max-w-[90vw] object-contain"
                draggable={false}
              />
            </div>

            {/* AR Overlay Simulation */}
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-4 left-4 right-4"
              >
                <Card className="border-white/20 bg-black/60 text-white backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                        <QrCode className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">
                            {experience.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className="shrink-0 border-primary/30 bg-primary/10 text-primary text-xs"
                          >
                            {typeLabels[experience.type] || experience.type}
                          </Badge>
                        </div>
                        {experience.description && (
                          <p className="mt-1 text-sm text-white/70 line-clamp-2">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* QR Code Overlay */}
        <AnimatePresence>
          {showQr && experience.qrCodeUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/70"
              onClick={() => setShowQr(false)}
            >
              <Card
                className="mx-4 max-w-sm border-border bg-card p-8 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <CardContent className="p-0 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    Código QR de Acceso
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Escanea este código para acceder a la experiencia desde tu
                    celular.
                  </p>
                  <div className="mt-4 inline-block overflow-hidden rounded-lg border bg-white p-2">
                    <img
                      src={experience.qrCodeUrl}
                      alt="Código QR"
                      className="h-40 w-40 object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
