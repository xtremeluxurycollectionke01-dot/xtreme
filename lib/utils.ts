// lib/utils.ts
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
}

export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  }
  
  // If it starts with +, remove it
  if (cleaned.startsWith('254')) {
    return cleaned;
  }
  
  return cleaned;
}