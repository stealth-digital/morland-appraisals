/**
 * Responsive Cloudinary sources. Any transform already on the URL is replaced,
 * so the preload in <head> and the <img> in the page always request the exact
 * same files and the browser never downloads a hero twice.
 */
const WIDTHS = [480, 768, 1280, 1920];

export function cloudinaryAt(url: string, width: number): string {
  return url.replace(/\/upload\/(?:[^/]*\/)?(?=v\d+\/)/, `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

export interface Responsive {
  src: string;
  srcset: string;
  sizes: string;
}

/** Full-bleed images: page heroes and photo bands. */
export function fullBleed(url: string, widths = WIDTHS): Responsive {
  return {
    src: cloudinaryAt(url, widths[widths.length - 1]),
    srcset: widths.map((w) => `${cloudinaryAt(url, w)} ${w}w`).join(', '),
    sizes: '100vw',
  };
}
