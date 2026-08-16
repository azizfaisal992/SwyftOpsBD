import { Map, NavigationControl } from "bkoi-gl";
import "bkoi-gl/style.css";
import { useEffect, useRef, useState } from "react";

const DHAKA_CENTER = [90.4125, 23.8103];
const POINT_SOURCE = "swiftops-points";
const POINT_LAYER = "swiftops-points-layer";
const ROUTE_SOURCE = "swiftops-route";
const ROUTE_LAYER = "swiftops-route-layer";

const validPoint = (point) =>
  Number.isFinite(Number(point?.latitude)) &&
  Number.isFinite(Number(point?.longitude));

const pointsGeoJson = (markers) => ({
  type: "FeatureCollection",
  features: markers.filter(validPoint).map((marker) => ({
    type: "Feature",
    properties: { label: marker.label || "" },
    geometry: {
      type: "Point",
      coordinates: [Number(marker.longitude), Number(marker.latitude)],
    },
  })),
});

const routeGeoJson = (geometry) => ({
  type: "FeatureCollection",
  features: geometry?.coordinates?.length
    ? [{ type: "Feature", properties: {}, geometry }]
    : [],
});

const updateSource = (map, id, data) => {
  const source = map.getSource(id);
  if (source) source.setData(data);
};

const BarikoiMap = ({
  center,
  markers = [],
  routeGeometry = null,
  onLocationSelect,
  className = "h-full min-h-64 w-full",
  zoom = 13,
  interactive = true,
}) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const selectRef = useRef(onLocationSelect);
  const [mapReady, setMapReady] = useState(false);
  const accessToken = import.meta.env.VITE_BARIKOI_MAP_API_KEY
    || import.meta.env.VITE_BARIKOI_MAP_KEY;
  const selectedCenter = validPoint(center)
    ? [Number(center.longitude), Number(center.latitude)]
    : (markers.find(validPoint)
      ? [
          Number(markers.find(validPoint).longitude),
          Number(markers.find(validPoint).latitude),
        ]
      : DHAKA_CENTER);

  useEffect(() => {
    selectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    if (!accessToken || !containerRef.current || mapRef.current) return undefined;
    const map = new Map({
      container: containerRef.current,
      accessToken,
      center: selectedCenter,
      zoom,
      interactive,
      attributionControl: true,
    });
    mapRef.current = map;
    if (interactive) map.addControl(new NavigationControl(), "top-right");
    map.on("click", (event) => {
      selectRef.current?.({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      });
    });
    map.on("load", () => {
      map.addSource(POINT_SOURCE, {
        type: "geojson",
        data: pointsGeoJson(markers),
      });
      map.addLayer({
        id: POINT_LAYER,
        type: "circle",
        source: POINT_SOURCE,
        paint: {
          "circle-radius": 9,
          "circle-color": "#0755d3",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 3,
        },
      });
      map.addSource(ROUTE_SOURCE, {
        type: "geojson",
        data: routeGeoJson(routeGeometry),
      });
      map.addLayer({
        id: ROUTE_LAYER,
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#0755d3",
          "line-width": 5,
          "line-opacity": 0.85,
        },
      });
      setMapReady(true);
    });
    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  // The map instance is intentionally created only once per mounted view.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    updateSource(map, POINT_SOURCE, pointsGeoJson(markers));
    updateSource(map, ROUTE_SOURCE, routeGeoJson(routeGeometry));
    if (validPoint(center)) {
      map.flyTo({
        center: [Number(center.longitude), Number(center.latitude)],
        zoom,
        duration: 700,
      });
    }
  }, [center, mapReady, markers, routeGeometry, zoom]);

  if (!accessToken) {
    return (
      <div className={`${className} grid place-items-center bg-[#eef3ff] p-6 text-center text-sm text-[#4c5261]`}>
        Add VITE_BARIKOI_MAP_API_KEY to the frontend environment and restart Vite.
      </div>
    );
  }

  return <div className={className} ref={containerRef} />;
};

export default BarikoiMap;
