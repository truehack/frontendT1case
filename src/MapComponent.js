import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Исправляем иконки
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Компонент для обработки кликов по карте
function MapClickHandler({ onMapClick, inputMode }) {
  useMapEvents({
    click: (e) => {
      if (inputMode === 'manual') {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

function createNumberedIcon(number, color = '#0066cc') {
  return L.divIcon({
    html: `<div style="
      background: ${color};
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">${number}</div>`,
    className: 'custom-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function MapComponent({ 
  points, 
  manualPoints, 
  inputMode, 
  onMapClick,
  baselineRoute, 
  optimizedRoute, 
  showRoute 
}) {
  const moscowPosition = [55.751244, 37.618423];
  const moscowBounds = [
    [55.4900, 37.2500],
    [55.9700, 37.9500]
  ];

  const getRouteCoordinates = () => {
    if (showRoute === 'baseline' && baselineRoute?.order) {
      return baselineRoute.order.map(id => {
        const point = points.find(p => p.id === id);
        return point ? [point.lat, point.lng] : null;
      }).filter(Boolean);
    }
    if (showRoute === 'optimized' && optimizedRoute?.order) {
      return optimizedRoute.order.map(id => {
        const point = points.find(p => p.id === id);
        return point ? [point.lat, point.lng] : null;
      }).filter(Boolean);
    }
    return [];
  };

  const routeCoordinates = getRouteCoordinates();
  const displayPoints = points.length > 0 ? points : manualPoints;

  return (
    <MapContainer 
      center={moscowPosition} 
      zoom={10}
      minZoom={10}
      maxZoom={16}
      maxBounds={moscowBounds}
      maxBoundsViscosity={1.0}
      className="map-container"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {/* Обработчик кликов */}
      <MapClickHandler onMapClick={onMapClick} inputMode={inputMode} />
      
      {/* Точки с номерами */}
      {displayPoints.map((point, index) => (
        <Marker 
          key={point.id} 
          position={[point.lat, point.lng]}
          icon={createNumberedIcon(index + 1, point.type === 'manual' ? '#ff6b6b' : '#0066cc')}
        >
          <Popup>
            <strong>{point.address}</strong><br/>
            {point.lat.toFixed(4)}, {point.lng.toFixed(4)}<br/>
            {point.type === 'manual' ? 'Ручная' : 'Авто'}
          </Popup>
        </Marker>
      ))}

      {/* Линия маршрута */}
      {routeCoordinates.length > 1 && (
        <Polyline 
          positions={routeCoordinates}
          color={showRoute === 'baseline' ? '#ff6b6b' : '#4caf50'}
          weight={5}
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
}

export default MapComponent;