export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export const shareProduct = async (productName: string, productId: string): Promise<boolean> => {
  const shareData: ShareData = {
    title: `${productName} | Mi Tienda`,
    text: `¡Mira este producto: ${productName}!`,
    url: typeof window !== 'undefined' ? `${window.location.origin}/productos/${productId}` : `/productos/${productId}`,
  };

  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share(shareData);
      return true;
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al compartir:', error);
    return false;
  }
};
