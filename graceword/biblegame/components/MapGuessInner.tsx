"use client";

import { useEffect, useMemo, useState } from "react";
import type { FeatureCollection } from "geojson";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Pane,
  Polyline,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { publicUrl } from "@/lib/image";
import type { UiText } from "@/lib/i18n/types";
import type { MapLabel } from "@/lib/map-labels";
import type { LatLng, MapRoutePoint } from "@/lib/types";
import MapLabels from "./MapLabels";

function ClickCatcher({ onGuess }: { onGuess: (point: LatLng) => void }) {
  useMapEvents({
    click(event) {
      onGuess({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

function FitRoute({ points }: { points: MapRoutePoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    map.fitBounds(
      points.map((point) => [point.lat, point.lng]) as [number, number][],
      { padding: [24, 24], maxZoom: 7 },
    );
  }, [map, points]);

  return null;
}

function spreadRoute(points: MapRoutePoint[]): MapRoutePoint[] {
  const out: MapRoutePoint[] = [];
  for (const point of points) {
    const nearby = out.filter(
      (item) =>
        Math.abs(item.lat - point.lat) < 0.06 &&
        Math.abs(item.lng - point.lng) < 0.06,
    ).length;
    if (nearby === 0) {
      out.push(point);
    } else {
      const angle = (nearby * Math.PI * 2) / 6;
      out.push({
        ...point,
        lat: point.lat + Math.sin(angle) * 0.045,
        lng: point.lng + Math.cos(angle) * 0.045,
      });
    }
  }
  return out;
}

type GeoData = {
  land: FeatureCollection;
  lakes: FeatureCollection;
  rivers: FeatureCollection;
};

let geoPromise: Promise<GeoData> | null = null;

function loadGeoData(): Promise<GeoData> {
  if (!geoPromise) {
    const load = async (path: string) => {
      const res = await fetch(publicUrl(path));
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      return (await res.json()) as FeatureCollection;
    };
    geoPromise = Promise.all([
      load("/geo/land.json"),
      load("/geo/lakes.json"),
      load("/geo/rivers.json"),
    ])
      .then(([land, lakes, rivers]) => ({ land, lakes, rivers }))
      .catch((error) => {
        geoPromise = null;
        throw error;
      });
  }
  return geoPromise;
}

const LAND_STYLE = {
  color: "#cbbd9f",
  weight: 0.6,
  fillColor: "#f2e8d5",
  fillOpacity: 1,
};

const LAKE_STYLE = {
  color: "#8fb6c9",
  weight: 0.5,
  fillColor: "#bcd6e2",
  fillOpacity: 1,
};

const RIVER_STYLE = {
  color: "#8fb6c9",
  weight: 0.8,
  opacity: 0.85,
};

interface MapGuessInnerProps {
  guess: LatLng | null;
  onGuess: (point: LatLng) => void;
  labels: MapLabel[];
  mapText: UiText["map"];
  actual?: LatLng;
  actualLabel?: string;
  revealed?: boolean;
  hideLabels?: string[];
  route?: MapRoutePoint[];
  heightClassName?: string;
}

export default function MapGuessInner({
  guess,
  onGuess,
  labels,
  mapText,
  actual,
  actualLabel,
  revealed = false,
  hideLabels = [],
  route,
  heightClassName = "h-56 w-full rounded-xl sm:h-64",
}: MapGuessInnerProps) {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [failed, setFailed] = useState(false);
  const routePoints = useMemo(
    () => (route && route.length > 0 ? spreadRoute(route) : null),
    [route],
  );

  useEffect(() => {
    let cancelled = false;
    loadGeoData()
      .then((data) => {
        if (!cancelled) setGeo(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative">
      <MapContainer
        center={[33, 30]}
        zoom={4}
        minZoom={3}
        maxZoom={8}
        zoomSnap={0.5}
        scrollWheelZoom
        maxBounds={
          [
            [8, -12],
            [58, 52],
          ] as [[number, number], [number, number]]
        }
        maxBoundsViscosity={0.7}
        attributionControl={false}
        className={heightClassName}
        style={{ background: "#dfeaf0" }}
      >
        <Pane name="basemap" style={{ zIndex: 250 }}>
          {geo && (
            <>
              <GeoJSON
                data={geo.land}
                style={LAND_STYLE}
                interactive={false}
                pane="basemap"
              />
              <GeoJSON
                data={geo.lakes}
                style={LAKE_STYLE}
                interactive={false}
                pane="basemap"
              />
              <GeoJSON
                data={geo.rivers}
                style={RIVER_STYLE}
                interactive={false}
                pane="basemap"
              />
            </>
          )}
        </Pane>

        <MapLabels labels={labels} hidden={routePoints ? [] : hideLabels} />
        {!routePoints && <ClickCatcher onGuess={onGuess} />}

        {routePoints && (
          <>
            <FitRoute points={routePoints} />
            {routePoints.map((point, i) => (
              <CircleMarker
                key={`${point.label}-${i}`}
                center={[point.lat, point.lng]}
                radius={9}
                interactive={false}
                pathOptions={{
                  color: "#b8862f",
                  fillColor: "#b8862f",
                  fillOpacity: 0.95,
                }}
              >
                <Tooltip
                  permanent
                  direction="center"
                  opacity={1}
                  className="map-label map-label--route-number"
                >
                  {i + 1}
                </Tooltip>
              </CircleMarker>
            ))}
            <Polyline
              positions={
                routePoints.map((point) => [point.lat, point.lng]) as [
                  number,
                  number,
                ][]
              }
              pathOptions={{ color: "#b8862f", dashArray: "4 6", weight: 2 }}
            />
          </>
        )}

        {!routePoints && guess && (
          <CircleMarker
            center={[guess.lat, guess.lng]}
            radius={8}
            pathOptions={{
              color: "#b8862f",
              fillColor: "#b8862f",
              fillOpacity: 0.9,
            }}
          />
        )}

        {!routePoints && revealed && actual && (
          <CircleMarker
            center={[actual.lat, actual.lng]}
            radius={8}
            pathOptions={{
              color: "#1f6f4a",
              fillColor: "#1f6f4a",
              fillOpacity: 0.9,
            }}
          />
        )}

        {!routePoints && revealed && actual && actualLabel && (
          <CircleMarker
            center={[actual.lat, actual.lng]}
            radius={0}
            interactive={false}
            pathOptions={{ opacity: 0, fillOpacity: 0 }}
          >
            <Tooltip
              permanent
              direction="top"
              offset={[0, -10]}
              opacity={1}
              className="map-label map-label--reveal"
            >
              {actualLabel}
            </Tooltip>
          </CircleMarker>
        )}

        {!routePoints && revealed && actual && guess && (
          <Polyline
            positions={
              [
                [guess.lat, guess.lng],
                [actual.lat, actual.lng],
              ] as [number, number][]
            }
            pathOptions={{ color: "#1f6f4a", dashArray: "4 6" }}
          />
        )}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-1 right-1 z-[500] rounded bg-white/75 px-1.5 py-0.5 text-[9px] leading-tight text-ink/55">
        {mapText.attribution}
      </div>

      {failed && (
        <div className="pointer-events-none absolute left-2 top-2 z-[500] rounded bg-white/80 px-2 py-1 text-[10px] text-rose-600">
          {mapText.failed}
        </div>
      )}
    </div>
  );
}
