import 'leaflet/dist/leaflet.css';

import L, { LatLngTuple } from 'leaflet';
import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import styles from './map.module.scss';
L.Icon.Default.imagePath = '/images/';

const DEFAULT_CENTER: LatLngTuple = [60.171944, 24.941389];

interface Props {
  position: LatLngTuple | null;
}

const Map: React.FC<Props> = ({ position }) => {
  const center = position || DEFAULT_CENTER;

  return (
    <MapContainer
      center={center}
      className={styles.mapContainer}
      minZoom={3}
      maxZoom={18}
      zoom={15}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {position && <Marker position={position} />}
    </MapContainer>
  );
};

export default Map;
