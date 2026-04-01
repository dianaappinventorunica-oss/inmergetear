import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import QRCode from 'qrcode';

export async function GET() {
  try {
    const experiences = await db.experience.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Error al obtener las experiencias' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, type, category } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'El título y la imagen son obligatorios' },
        { status: 400 }
      );
    }

    // Create the experience in DB first
    const experience = await db.experience.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        type: type || '360',
        category: category || 'general',
        isPublished: true,
      },
    });

    // Generate QR code as base64 data URL (compatible con cualquier hosting)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'http://localhost:3000';
    const qrContent = `${baseUrl}/#/experience/${experience.id}`;

    const qrCodeBase64 = await QRCode.toDataURL(qrContent, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0d3b3b',
        light: '#ffffff',
      },
    });

    // Update the experience with QR code as base64
    const updatedExperience = await db.experience.update({
      where: { id: experience.id },
      data: { qrCodeUrl: qrCodeBase64 },
    });

    return NextResponse.json(updatedExperience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Error al crear la experiencia' },
      { status: 500 }
    );
  }
}
