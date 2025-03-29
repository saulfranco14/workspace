export const getFingerprint = () => {
  if (typeof window !== 'undefined') {
    const fingerprint = localStorage.getItem('device_fingerprint');

    if (fingerprint) {
      return fingerprint;
    } else {
      const newFingerprint = `${navigator.userAgent}-${window.screen.width}x${window.screen.height}-${new Date().getTime()}`;
      localStorage.setItem('device_fingerprint', newFingerprint);
      return newFingerprint;
    }
  }

  return null;
};
