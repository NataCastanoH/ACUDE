// Antepone la ruta base del sitio (en GitHub Pages: /ACUDE) a una ruta interna
export const url = (ruta = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${ruta.replace(/^\//, '')}`;
