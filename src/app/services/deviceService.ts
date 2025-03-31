import FingerprintJS from '@fingerprintjs/fingerprintjs';

const fpPromise = typeof window !== 'undefined' ? FingerprintJS.load() : null;

export const getFingerprint = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Fingerprint solo puede ser generado en el cliente');
  }

  if (!fpPromise) {
    throw new Error('FingerprintJS no está inicializado');
  }

  const fp = await fpPromise;
  const result = await fp.get();

  const fingerprint = result.visitorId;
  return fingerprint;
};
