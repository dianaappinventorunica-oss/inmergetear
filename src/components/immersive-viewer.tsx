'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  X, Share2, QrCode, Maximize2, Minimize2, RotateCcw,
  Camera, CameraOff, Eye, Smartphone, Loader2,
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

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function loadCSS(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) { resolve(); return; }
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.onload = () => resolve();
    l.onerror = reject;
    document.head.appendChild(l);
  });
}

function Pannellum360({ imageUrl }: { imageUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        setLoading(true);
        setError('');
        await loadCSS('https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css');
        await loadScript('https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js');
        if (cancelled || !containerRef.current || !(window as any).pannellum) return;
        if (viewerRef.current) { viewerRef.current.destroy(); viewerRef.current = null; }
        viewerRef.current = (window as any).pannellum.viewer(containerRef.current, {
          type: 'equirectangular',
          panorama: imageUrl,
          autoLoad: true,
          compass: false,
          showZoomCtrl: false,
          showFullscreenCtrl: false,
          mouseZoom: true,
          draggable: true,
          friction: 0.15,
          minHfov: 30,
          maxHfov: 120,
          yaw: 0,
          pitch: 0,
          hfov: 100,
          multiRes: false,
          keyboardZoom: true,
          autorotate: -2,
          autorotateInactivityDelay: 3000,
        });
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError('No se pudo cargar el visor 360. Intenta con una imagen panoramica.');
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
      if (viewerRef.current) { viewerRef.current.destroy(); viewerRef.current = null; }
    };
  }, [imageUrl]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Card className="border-white/20 bg-black/60 text-white backdrop-blur-md max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-sm">{error}</p>
            <p className="mt-2 text-xs text-white/60">Tip: Usa una foto panoramica para la mejor experiencia 360.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-sm text-white/80">Cargando vista 360...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

function ARCameraView({ experience }: { experience: Experience; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [arActive, setArActive] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const animFrame = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    async function startCamera() {
      try {
        setLoading(true);
        setError('');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (cancelled) { mediaStream.getTracks().forEach(t => t.stop()); return; }
        if (videoRef.current) { videoRef.current.srcObject = mediaStream; }
        setStream(mediaStream);
        setLoading(false);
        setTimeout(() => { if (!cancelled) setArActive(true); }, 800);
      } catch (err) {
        if (!cancelled) {
          setError('No se pudo acceder a la camara. Asegurate de dar permisos.');
          setLoading(false);
        }
      }
    }
    startCamera();
    return () => {
      cancelled = true;
      if (stream) { stream.getTracks().forEach(t => t.stop()); }
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  useEffect(() => {
    if (!arActive || !imgRef.current) return;
    let beta = 0, gamma = 0;
    function handleOrientation(e: DeviceOrientationEvent) {
      beta = e.beta || 0;
      gamma = e.gamma || 0;
    }
    function animate() {
      if (!imgRef.current) return;
      const rotX = Math.max(-30, Math.min(30, beta * 0.3));
      const rotY = Math.max(-30, Math.min(30, gamma * 0.3));
      imgRef.current.style.transform = `translate(-50%, -50%) rotateY(${rotY}deg) rotateX(${-rotX}deg)`;
      animFrame.current = requestAnimationFrame(animate);
    }
    window.addEventListener('deviceorientation', handleOrientation);
    animFrame.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [arActive]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black p-8">
        <Card className="border-white/20 bg-black/80 text-white backdrop-blur-md max-w-md">
          <CardContent className="p-6 text-center">
            <CameraOff className="mx-auto h-10 w-10 text-red-400" />
            <p className="mt-3 text-sm">{error}</p>
            <p className="mt-2 text-xs text-white/60">Nota: La AR funciona mejor en celulares con camara trasera.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-sm text-white/80">Activando camara...</p>
          </div>
        </div>
      )}
      {arActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          ref={imgRef}
          className="absolute left-1/2 top-1/2 z-10 w-[75vw] max-w-[500px]"
          style={{ transform: 'translate(-50%, -50%)', transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <div className="relative rounded-2xl border-2 border-cyan-400/60 bg-black/20 shadow-[0_0_30px_rgba(0,255,255,0.3)] backdrop-blur-sm overflow-hidden">
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg z-10" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg z-10" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg z-10" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg z-10" />
            <img src={experience.imageUrl} alt={experience.title} className="w-full rounded-2xl" draggable={false} />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-2xl">
              <p className="text-white font-semibold text-sm">{experience.title}</p>
              {experience.description && (
                <p className="text-white/70 text-xs mt-1 line-clamp-2">{experience.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
      {arActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-red-500 text-white border-none px-3 py-1 text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            AR Activo
          </Badge>
        </div>
      )}
      {arActive && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-xs text-center">
            Apunta tu camara y mueve el dispositivo para explorar
          </div>
        </div>
      )}
    </div>
  );
}

export default function ImmersiveViewer({ experience, onClose }: ImmersiveViewerProps) {
  const [viewMode, setViewMode] = useState<'360' | 'ar' | 'photo'>(
    experience?.type === 'ar' ? 'ar' : experience?.type === '360' ? '360' : 'photo'
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (experience) {
      document.addEventListener('keydown', h);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [experience, onClose]);

  const handleShare = async () => {
    if (!experience) return;
    try { await navigator.clipboard.writeText(`${window.location.origin}/#/experience/${experience.id}`); toast.success('Enlace copiado'); } catch { toast.error('No se pudo copiar'); }
  };

  if (!experience) return null;
  const typeLabels: Record<string, string> = { '360': '360', ar: 'AR', vr: 'VR' };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black" ref={containerRef}>
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-sm p-1">
            <button onClick={() => setViewMode('photo')} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${viewMode === 'photo' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}><Eye className="h-3.5 w-3.5" /> Foto</button>
            <button onClick={() => setViewMode('360')} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${viewMode === '360' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}><Smartphone className="h-3.5 w-3.5" /> 360</button>
            <button onClick={() => setViewMode('ar')} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${viewMode === 'ar' ? 'bg-cyan-400 text-black' : 'text-white/70 hover:text-white'}`}><Camera className="h-3.5 w-3.5" /> AR</button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
            {experience.qrCodeUrl && (
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setShowQr(true)}><QrCode className="h-4 w-4" /></Button>
            )}
            {viewMode !== 'ar' && (
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={toggleFullscreen}>{isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</Button>
            )}
          </div>
        </div>

        <div className="absolute top-14 left-0 right-0 z-20 flex justify-center px-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
            <h3 className="text-white text-sm font-medium truncate max-w-[200px] sm:max-w-[400px]">{experience.title}</h3>
            <Badge variant="outline" className="shrink-0 border-cyan-400/40 bg-cyan-400/10 text-cyan-300 text-[10px] px-1.5">{typeLabels[experience.type] || experience.type}</Badge>
          </div>
        </div>

        <div className="absolute inset-0 top-20">
          {viewMode === '360' && <Pannellum360 imageUrl={experience.imageUrl} />}
          {viewMode === 'ar' && <ARCameraView experience={experience} onClose={onClose} />}
          {viewMode === 'photo' && (
            <div className="flex h-full w-full items-center justify-center p-4">
              <div className="relative max-h-[85vh] max-w-[95vw]">
                <img src={experience.imageUrl} alt={experience.title} className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl shadow-2xl" draggable={false} />
                {experience.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl p-4">
                    <p className="text-white text-sm">{experience.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {viewMode === '360' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-xs flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5" /> Arrastra para mirar alrededor
            </div>
          </div>
        )}

        <AnimatePresence>
          {showQr && experience.qrCodeUrl && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowQr(false)}>
              <Card className="mx-4 max-w-sm border-border bg-card p-8 text-center" onClick={e => e.stopPropagation()}>
                <CardContent className="p-0 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><QrCode className="h-6 w-6 text-primary" /></div>
                  <h3 className="mt-4 text-lg font-semibold">Codigo QR de Acceso</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Escanea para acceder desde tu celular.</p>
                  <div className="mt-4 inline-block overflow-hidden rounded-lg border bg-white p-2">
                    <img src={experience.qrCodeUrl} alt="QR" className="h-40 w-40 object-contain" />
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
