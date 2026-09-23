export const WHATSAPP_NUMBER = "27111234567";

export function whatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
