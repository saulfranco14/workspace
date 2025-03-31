import FingerprintJS from '@fingerprintjs/fingerprintjs';

const fpPromise = typeof window !== 'undefined' ? FingerprintJS.load() : null;

export const getFingerprint = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Fingerprint solo puede ser generado en el cliente');
  }

  if (!fpPromise) {
    throw new Error('FingerprintJS no está inicializado');
  }

  try {
    const fp = await fpPromise;
    const result = await fp.get();

    const fingerprint = result?.visitorId ?? 'No visitorId found';

    return fingerprint;
  } catch (error) {
    console.error('Error obteniendo fingerprint:', error);
    return null;
  }
};
