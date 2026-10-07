/**
 * Monetary & Formatting Utilities
 * Uses integer centavo values exclusively to prevent floating-point rounding errors.
 */

export function pesosToCentavos(pesos: number): number {
  return Math.round(pesos * 100);
}

export function centavosToPesos(centavos: number): number {
  return centavos / 100;
}

export function formatCurrency(centavos: number): string {
  const safeCentavos = Number.isFinite(centavos) ? Math.round(centavos) : 0;
  const pesos = (safeCentavos / 100).toFixed(2);
  const [whole, fraction] = pesos.split('.');
  const formattedWhole = Number(whole).toLocaleString('en-PH');
  return `₱${formattedWhole}.${fraction}`;
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function calculateItemSubtotal(unitPriceCentavos: number, quantity: number): number {
  if (quantity <= 0 || unitPriceCentavos <= 0) return 0;
  return Math.round(unitPriceCentavos) * Math.round(quantity);
}

export function calculateOrderTotal(items: { subtotalCentavos: number }[]): number {
  return items.reduce((sum, item) => sum + Math.round(item.subtotalCentavos), 0);
}

export function calculateTotalQuantity(items: { quantity: number }[]): number {
  return items.reduce((sum, item) => sum + Math.round(item.quantity), 0);
}
