"use client";

import dynamic from "next/dynamic";
import type { UiText } from "@/lib/i18n/types";
import type { MapLabel } from "@/lib/map-labels";
import type { LatLng, MapRoutePoint } from "@/lib/types";

const MapGuessInner = dynamic(() => import("./MapGuessInner"), {
  ssr: false,
  loading: () => (
    <div className="h-56 w-full animate-pulse rounded-xl border border-ink/10 bg-ink/5 sm:h-64" />
  ),
});

interface MapGuessProps {
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

export default function MapGuess(props: MapGuessProps) {
  return <MapGuessInner {...props} />;
}
