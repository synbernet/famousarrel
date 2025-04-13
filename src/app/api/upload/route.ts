import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const audioFile = formData.get('audioFile') as File;
    const coverImage = formData.get('coverImage') as File;

    if (!title || !audioFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create directories if they don't exist
    const publicDir = path.join(process.cwd(), 'public');
    const musicDir = path.join(publicDir, 'music');
    const imagesDir = path.join(publicDir, 'images');

    // Save audio file
    const audioFileName = `${Date.now()}-${audioFile.name}`;
    const audioPath = path.join(musicDir, audioFileName);
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    await writeFile(audioPath, audioBuffer);

    let imagePath = '';
    if (coverImage) {
      const imageFileName = `${Date.now()}-${coverImage.name}`;
      imagePath = path.join(imagesDir, imageFileName);
      const imageBuffer = Buffer.from(await coverImage.arrayBuffer());
      await writeFile(imagePath, imageBuffer);
    }

    return NextResponse.json({
      success: true,
      audioPath: `/music/${audioFileName}`,
      imagePath: imagePath ? `/images/${path.basename(imagePath)}` : ''
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
} 