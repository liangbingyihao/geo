"use client";

import { useEffect, useState } from "react";
import { CircleMarker, Tooltip, useMap } from "react-leaflet";
import { visibleMapLabels, type MapLabel } from "@/lib/map-labels";

interface MapLabelsProps {
  labels: MapLabel[];
  hidden?: string[];
}

export default function MapLabels({ labels, hidden = [] }: MapLabelsProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());

  useEffect(() => {
    const update = () => setZoom(map.getZoom());
    update();
    map.on("zoomend", update);
    return () => {
      map.off("zoomend", update);
    };
  }, [map]);

  return (
    <>
      {visibleMapLabels(zoom, labels, hidden).map((label) => (
        <CircleMarker
          key={label.id}
          center={[label.lat, label.lng]}
          radius={0}
          interactive={false}
          pathOptions={{ opacity: 0, fillOpacity: 0 }}
        >
          <Tooltip
            permanent
            direction="center"
            opacity={1}
            className={`map-label map-label--${label.kind}`}
          >
            {label.name}
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}
