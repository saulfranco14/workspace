import FingerprintJS from '@fingerprintjs/fingerprintjs';

const fpPromise = typeof window !== 'undefined' ? FingerprintJS.load() : null;

export const getFingerprint = async () => {
  if (typeof window === 'undefined') {
    console.warn('Fingerprint solo puede ser generado en el cliente');
    return null;
  }

  if (!fpPromise) {
    console.warn('FingerprintJS no está inicializado');
    return null;
  }

  try {
    const fp = await fpPromise;
    const result = await fp.get();

    const fingerprint = result?.visitorId ?? null;

    return fingerprint;
  } catch (error) {
    console.error('Error obteniendo fingerprint:', error);
    return null;
  }
};
