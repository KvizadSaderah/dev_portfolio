// Simple XOR-based cipher for client-side obfuscation.
// This prevents casual extraction of keys from LocalStorage.
// The password acts as the seed for the encryption.

export const encryptData = (text: string, secret: string): string => {
  if (!text || !secret) return text;
  let result = '';
  for (let i = 0; i < text.length; i++) {
    // XOR the char code with the secret char code
    const charCode = text.charCodeAt(i) ^ secret.charCodeAt(i % secret.length);
    // Convert to hex to make it string-safe
    result += charCode.toString(16).padStart(2, '0');
  }
  // Add a prefix to identify encrypted data
  return `ENC:${result}`;
};

export const decryptData = (encrypted: string, secret: string): string | null => {
  if (!encrypted) return null;
  if (!encrypted.startsWith('ENC:')) return null; // Not encrypted or legacy data
  
  const hex = encrypted.substring(4);
  let result = '';
  
  try {
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substr(i, 2), 16);
      const xorChar = secret.charCodeAt((i / 2) % secret.length);
      result += String.fromCharCode(charCode ^ xorChar);
    }
    return result;
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
};