export const getBrowserLocation = ({
  timeout = 10000,
  maximumAge = 30000,
} = {}) =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords, timestamp }) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          capturedAt: new Date(timestamp).toISOString(),
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout, maximumAge },
    );
  });

const toLocation = ({ coords, timestamp }) => ({
  latitude: coords.latitude,
  longitude: coords.longitude,
  accuracy: coords.accuracy,
  capturedAt: new Date(timestamp).toISOString(),
});

export const watchBrowserLocation = (
  onLocation,
  onError = () => {},
  {
    maximumAge = 10000,
    timeout = 20000,
  } = {},
) => {
  if (!navigator.geolocation) {
    onError(new Error("Location services are not available in this browser."));
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => onLocation(toLocation(position)),
    onError,
    { enableHighAccuracy: true, maximumAge, timeout },
  );

  return () => navigator.geolocation.clearWatch(watchId);
};
