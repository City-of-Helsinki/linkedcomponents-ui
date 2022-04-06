import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import L, { LatLngTuple } from 'leaflet';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureGroup, MapContainer, Marker, TileLayer } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

import useLocale from '../../../hooks/useLocale';
import styles from './map.module.scss';
import { localizeMap } from './utils';
L.Icon.Default.imagePath = '/images/';

const DEFAULT_CENTER: LatLngTuple = [60.171944, 24.941389];

interface Props {
  position: LatLngTuple | null;
}

const Map: React.FC<Props> = ({ position }) => {
  const center = position || DEFAULT_CENTER;
  const locale = useLocale();
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featureGroup = React.useRef<any>();

  const onCreated = () => {
    const drawnItems = featureGroup.current._layers;

    if (Object.keys(drawnItems).length > 1) {
      Object.keys(drawnItems).forEach((layerid, index) => {
        if (index > 0) return;
        const layer = drawnItems[layerid];
        featureGroup.current.removeLayer(layer);
      });
    }
  };

  const handleAction = () => {
    console.log('action');
  };

  React.useEffect(() => {
    localizeMap(t);
  }, [locale, t]);

  return (
    <MapContainer
      center={center}
      className={styles.mapContainer}
      minZoom={3}
      maxZoom={18}
      zoom={15}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup ref={featureGroup}>
        <EditControl
          position="topright"
          onCreated={onCreated}
          onDeleted={handleAction}
          onEdited={handleAction}
          draw={{
            circlemarker: false,
            circle: false,
            marker: true,
            polyline: false,
            polygon: false,
            rectangle: false,
          }}
        />
        {position && <Marker position={position} />}
      </FeatureGroup>
    </MapContainer>
  );
};

export default Map;
