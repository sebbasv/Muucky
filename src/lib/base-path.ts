/**
 * Prefijo de la URL cuando el sitio no vive en la raíz del dominio (GitHub Pages lo sirve en
 * /Muucky). Vacío en el resto de los casos. Next lo agrega solo a los links y a los archivos de
 * _next; las rutas a /public que se arman a mano tienen que pasar por acá.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
