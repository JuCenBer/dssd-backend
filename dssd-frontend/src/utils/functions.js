




export const truncateText = (texto, caracteres) => {
    if (texto.length <= caracteres) {
        return texto;
    }
    return texto.slice(0, caracteres) + '...';
};


export const capitalize = (text) => {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}


/**
 * Convierte un precio en centavos a un string formateado
 * @param cents - El precio en centavos (por ejemplo, 123456)
 * @param locale - Idioma/formato (ej: 'es-AR', 'en-US')
 * @param currency - Moneda (ej: 'ARS', 'USD')
 * @returns Precio formateado (ej: "1.234,56" o "1,234.56")
 */
export function formatPrice(cents, locale = 'es-AR', currency = 'ARS') {
    if (typeof cents !== 'number' || isNaN(cents)) return '';
  
    const amount = cents / 100;
  
    return amount.toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}

/**
 * Sanitiza el input de precio y lo convierte a centavos como entero
 * @param {string|number} input
 * @returns {number|null} - Precio en centavos o null si es inválido
 */
export function sanitizePriceInput(input) {
    if (typeof input !== 'string') input = String(input);
  
    // Quita espacios y separadores de miles (., o , dependiendo del idioma)
    const cleaned = input
      .trim()
      .replace(/[^0-9.,]/g, '') // Solo permite números, puntos y comas
      .replace(/\.(?=.*\.)/g, '') // Quita puntos extra (separadores de miles)
      .replace(/,(?=.*[,])/g, '') // Quita comas extra (separadores de miles)
  
    // Reemplaza coma por punto si es decimal
    const normalized = cleaned.replace(',', '.');
  
    const parsed = parseFloat(normalized);
    if (isNaN(parsed)) return null;
  
    return Math.round(parsed * 100);
}

/**
 * Formatea una fecha al formato "dd-mm-yyyy hh:mm"
 * @param {Date | string} date - Objeto Date o string parseable por Date.
 * @returns {string} Fecha formateada.
 */
export function formatDateDMY(date) {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}