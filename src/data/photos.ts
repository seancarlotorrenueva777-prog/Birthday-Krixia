export interface MemoryPhoto {
  id: number;
  src: string;
  caption: string;
}

export const photos: MemoryPhoto[] = [
  { id: 1, src: 'images/photo-01.jpg', caption: 'MEMORY 01 · PHOTO BOOTH PRINT' },
  { id: 2, src: 'images/photo-02.jpg', caption: 'MEMORY 02 · PHOTO BOOTH PRINT' },
  { id: 3, src: 'images/photo-03.jpg', caption: 'MEMORY 03 · PHOTO BOOTH PRINT' },
];
