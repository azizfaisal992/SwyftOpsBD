import { apiRequest } from "./apiClient";

const coordinates = (location, prefix) => ({
  [`${prefix}Latitude`]: location.latitude,
  [`${prefix}Longitude`]: location.longitude,
});

export const searchMapPlaces = (query) =>
  apiRequest(`/maps/autocomplete?q=${encodeURIComponent(query)}`);

export const reverseGeocode = ({ latitude, longitude }) =>
  apiRequest(
    `/maps/reverse-geocode?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`,
  );

export const getMapRoute = (origin, destination, profile = "car") => {
  const query = new URLSearchParams({
    ...coordinates(origin, "origin"),
    ...coordinates(destination, "destination"),
    profile,
  });
  return apiRequest(`/maps/route?${query.toString()}`);
};

export const getBrowserLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location services are not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      }),
      (error) => reject(new Error(
        error.code === error.PERMISSION_DENIED
          ? "Allow location access in your browser to use this feature."
          : "Your current location could not be determined.",
      )),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  });
