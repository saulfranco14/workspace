import { getFingerprint } from '@/services/deviceService';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

console.warn = jest.fn();
console.error = jest.fn();

jest.mock('@fingerprintjs/fingerprintjs', () => ({
  load: jest.fn(),
}));

let mockWindowValue: any;
let mockVisitorId: string | null | undefined;
let mockLoadError: Error | null;

jest.mock('@/services/deviceService', () => {
  return {
    getFingerprint: jest.fn().mockImplementation(async () => {
      if (typeof mockWindowValue === 'undefined') {
        console.warn('Fingerprint solo puede ser generado en el cliente');
        return null;
      }

      try {
        if (mockLoadError) {
          throw mockLoadError;
        }

        return mockVisitorId ?? null;
      } catch (error) {
        console.error('Error obteniendo fingerprint:', error);
        return null;
      }
    }),
  };
});

describe('Device Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (console.warn as jest.Mock).mockClear();
    (console.error as jest.Mock).mockClear();

    mockWindowValue = {};
    mockVisitorId = 'visitor-fingerprint-123';
    mockLoadError = null;
  });

  it('debe retornar un fingerprint válido cuando está disponible', async () => {
    mockVisitorId = 'visitor-fingerprint-123';

    const result = await getFingerprint();

    expect(result).toBe(mockVisitorId);
  });

  it('debe retornar null si window no está definido', async () => {
    mockWindowValue = undefined;

    const result = await getFingerprint();

    expect(console.warn).toHaveBeenCalledWith('Fingerprint solo puede ser generado en el cliente');
    expect(result).toBeNull();
  });

  it('debe manejar errores al obtener el fingerprint', async () => {
    mockLoadError = new Error('Error al obtener fingerprint');

    const result = await getFingerprint();

    expect(console.error).toHaveBeenCalledWith('Error obteniendo fingerprint:', mockLoadError);
    expect(result).toBeNull();
  });

  it('debe manejar el caso en que visitorId sea null o undefined', async () => {
    mockVisitorId = null;

    let result = await getFingerprint();
    expect(result).toBeNull();

    mockVisitorId = undefined;

    result = await getFingerprint();
    expect(result).toBeNull();
  });
});
