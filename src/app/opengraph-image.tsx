import { ogSize, renderOg } from '@/lib/og';

export const alt = 'Muucky: beef jerky argentino marinado con chimichurri';
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  // El nombre ya está en el logo: el titular es el producto.
  return renderOg({ title: 'Beef jerky argentino', subtitle: 'Marinado con chimichurri, limón y sal. Envío a todo el país.' });
}
