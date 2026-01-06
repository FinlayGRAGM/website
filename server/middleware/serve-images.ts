import { join } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const path = event.path
  
  // Check if the request is for an image
  if (path.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
    const filePath = join(process.cwd(), 'content', path)
    
    if (existsSync(filePath)) {
      const file = readFileSync(filePath)
      const mimeType = getMimeType(filePath)
      return new Response(file, {
        headers: { 'Content-Type': mimeType },
      })
    }
  }
})

function getMimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
}