import { NextRequest, NextResponse } from 'next/server';
import { dbGetAllExperiences, dbCreateExperience, generateId } from '@/lib/db';
import QRCode from 'qrcode';

export async function GET() {
  try {
    const experiences = await dbGetAllExperiences();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Error al obtener las experiencias' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, type, category } = body;
    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'El título y la imagen son obligatorios' }, { status: 400 });
    }

    const id = generateId();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'https://inmergetear-tau.vercel.app';
    const qrContent = `${baseUrl}/#/experience/${id}`;
    
    const qrCodeBase64 = await QRCode.toDataURL(qrContent, {
      width: 300,
      margin: 2,
      color: { dark: '#0d3b3b', light: '#ffffff' },
    });

    const experience = await dbCreateExperience({
      id,
      title,
      description: description || null,
      imageUrl,
      type: type || '360',
      category: category || 'general',
      qrCodeUrl: qrCodeBase64,
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Error al crear la experiencia' }, { status: 500 });
  }
}
