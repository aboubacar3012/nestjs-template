import { Injectable } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FileService {
  async generateFileName(originalName: string): Promise<string> {
    const fileExtension = extname(originalName);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${uniqueName}${fileExtension}`;
  }

  getFileUrl(filename: string): string {
    return `http://localhost:3000/uploads/${filename}`;
  }
}
