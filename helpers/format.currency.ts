export const FormatCurrency = (value: number, currency:string): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };
