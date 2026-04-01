'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import HowItWorksSection from '@/components/how-it-works-section';
import UploadSection from '@/components/upload-section';
import ExperiencesGallery from '@/components/experiences-gallery';
import ImmersiveViewer from '@/components/immersive-viewer';
import AcademicSection from '@/components/academic-section';
import Footer from '@/components/footer';

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

export default function Home() {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Hash-based routing: load experience from hash on hashchange events
  useEffect(() => {
    const loadExperienceFromHash = async () => {
      const hash = window.location.hash;
      const experienceMatch = hash.match(/^#\/experience\/(.+)$/);
      if (!experienceMatch) return;

      const id = experienceMatch[1];
      if (id === 'demo') return; // Skip demo
      try {
        const res = await fetch(`/api/experiences/${id}`);
        if (res.ok) {
          const experience = await res.json();
          setSelectedExperience(experience);
        }
      } catch (error) {
        console.error('Error loading experience from hash:', error);
      }
    };

    window.addEventListener('hashchange', loadExperienceFromHash);
    // Check initial hash asynchronously
    loadExperienceFromHash();

    return () => window.removeEventListener('hashchange', loadExperienceFromHash);
  }, []);

  const handleOpenViewer = useCallback((experience: Experience) => {
    setSelectedExperience(experience);
    window.location.hash = `#/experience/${experience.id}`;
  }, []);

  const handleCloseViewer = useCallback(() => {
    setSelectedExperience(null);
    if (window.location.hash.startsWith('#/experience/')) {
      history.pushState(null, '', window.location.pathname);
    }
  }, []);

  const handleDemo = useCallback(() => {
    const demoExperience: Experience = {
      id: 'demo',
      title: 'Demo - Laboratorio de Química',
      description:
        'Experiencia demostrativa de un laboratorio de química inmersivo. Arrastra para explorar la vista 360° del laboratorio.',
      imageUrl: '/ar-education.png',
      type: '360',
      category: 'ciencias',
      qrCodeUrl: null,
      isPublished: true,
      createdAt: new Date().toISOString(),
    };
    setSelectedExperience(demoExperience);
  }, []);

  const handleExperienceCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection onDemo={handleDemo} />
        <HowItWorksSection />
        <UploadSection onExperienceCreated={handleExperienceCreated} />
        <ExperiencesGallery
          onViewExperience={handleOpenViewer}
          refreshKey={refreshKey}
        />
        <AcademicSection />
      </main>
      <Footer />

      {/* Immersive Viewer Modal */}
      <ImmersiveViewer
        experience={selectedExperience}
        onClose={handleCloseViewer}
      />
    </div>
  );
}
