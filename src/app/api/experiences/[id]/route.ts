import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unlink, rm } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const experience = await db.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return NextResponse.json(
        { error: 'Experiencia no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: 'Error al obtener la experiencia' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const experience = await db.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return NextResponse.json(
        { error: 'Experiencia no encontrada' },
        { status: 404 }
      );
    }

    // Delete the experience from DB
    await db.experience.delete({
      where: { id },
    });

    // Try to delete files (best effort)
    const publicDir = path.join(process.cwd(), 'public');

    try {
      if (experience.imageUrl.startsWith('/uploads/')) {
        const imagePath = path.join(publicDir, experience.imageUrl);
        await unlink(imagePath);
      }
    } catch {
      // Ignore file deletion errors
    }

    try {
      if (experience.qrCodeUrl) {
        const qrPath = path.join(publicDir, experience.qrCodeUrl);
        await unlink(qrPath);
      }
    } catch {
      // Ignore file deletion errors
    }

    return NextResponse.json({ message: 'Experiencia eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la experiencia' },
      { status: 500 }
    );
  }
}
