import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import shipSvg from "../assets/navigation.svg"; // this should be a valid SVG path, NOT a React component
import "./Map.css"; // Assuming you'll create a CSS file for styling

const shipData = [
  {
    id: 1,
    name: "Ship Alpha",
    lat: 51.505, // London
    lon: -0.09,
    image:
      "https://imgs.search.brave.com/7BdNdoAiJtlygQ8yJWvzA2IyOJ_BGWbuUGiYgKZiorI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODM5/OTQ0MzkvcGhvdG8v/Ym93LXZpZXctb2Yt/bG9hZGVkLWNhcmdv/LXNoaXAtc2FpbGlu/Zy1vdXQtb2YtcG9y/dC5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9TElBN1BhSjFV/QjNJMllsa24tVVh3/akNoeUM0TkJfdTdw/Vm9va3h6dUVoND0",
    description: "Cargo ship docked in London.",
  },
  {
    id: 2,
    name: "Ship Beta",
    lat: 50.7128, // New York
    lon: -23.006,
    image:
      "https://imgs.search.brave.com/7BdNdoAiJtlygQ8yJWvzA2IyOJ_BGWbuUGiYgKZiorI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODM5/OTQ0MzkvcGhvdG8v/Ym93LXZpZXctb2Yt/bG9hZGVkLWNhcmdv/LXNoaXAtc2FpbGlu/Zy1vdXQtb2YtcG9y/dC5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9TElBN1BhSjFV/QjNJMllsa24tVVh3/akNoeUM0TkJfdTdw/Vm9va3h6dUVoND0",
    description: "Oil tanker near New York.",
  },
  {
    id: 3,
    name: "Ship Gamma",
    lat: 35.6895, // Tokyo
    lon: 139.6917,
    image:
      "https://imgs.search.brave.com/7BdNdoAiJtlygQ8yJWvzA2IyOJ_BGWbuUGiYgKZiorI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODM5/OTQ0MzkvcGhvdG8v/Ym93LXZpZXctb2Yt/bG9hZGVkLWNhcmdv/LXNoaXAtc2FpbGlu/Zy1vdXQtb2YtcG9y/dC5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9TElBN1BhSjFV/QjNJMllsa24tVVh3/akNoeUM0TkJfdTdw/Vm9va3h6dUVoND0",
    description: "Passenger ship approaching Tokyo port.",
  },
  {
    id: 4,
    name: "Ship Delta",
    lat: -33.8688, // Sydney
    lon: 151.2093,
    image:
      "https://imgs.search.brave.com/7BdNdoAiJtlygQ8yJWvzA2IyOJ_BGWbuUGiYgKZiorI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODM5/OTQ0MzkvcGhvdG8v/Ym93LXZpZXctb2Yt/bG9hZGVkLWNhcmdv/LXNoaXAtc2FpbGlu/Zy1vdXQtb2YtcG9y/dC5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9TElBN1BhSjFV/QjNJMllsa24tVVh3/akNoeUM0TkJfdTdw/Vm9va3h6dUVoND0",
    description: "Fishing vessel near Sydney waters.",
  },
  {
    id: 5,
    name: "Ship Omega",
    lat: -34.6037, // Buenos Aires
    lon: -58.3816,
    image:
      "https://imgs.search.brave.com/7BdNdoAiJtlygQ8yJWvzA2IyOJ_BGWbuUGiYgKZiorI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODM5/OTQ0MzkvcGhvdG8v/Ym93LXZpZXctb2Yt/bG9hZGVkLWNhcmdv/LXNoaXAtc2FpbGlu/Zy1vdXQtb2YtcG9y/dC5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9TElBN1BhSjFV/QjNJMllsa24tVVh3/akNoeUM0TkJfdTdw/Vm9va3h6dUVoND0",
    description: "Research ship in South Atlantic near Argentina.",
  },
];

const shipIcon = new L.Icon({
  iconUrl: shipSvg,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -20],
});

const tileLayers = {
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },

  esriWorldImagery: {
    name: "Esri WorldImagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },

  cartoDBDarkMatter: {
    name: "CartoDB Dark Matter",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },

  openTopoMap: {
    name: "OpenTopoMap",
    url: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
};

const ChangeTileLayer = () => {
  const map = useMap();
  const [currentTileLayer, setCurrentTileLayer] = useState("osm");
  const bounds = new L.LatLngBounds();
  shipData.forEach((ship) => bounds.extend([ship.lat, ship.lon]));

  useEffect(() => {
    if (shipData.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
      map.setMaxBounds(bounds.pad(0.5));
      map.setMinZoom(map.getBoundsZoom(bounds));
    } else {
      map.setView([51.505, -0.09], 4);
      map.setMaxBounds([
        [-90, -180],
        [90, 180],
      ]);
      map.setMinZoom(2);
    }
  }, [map, bounds, shipData]);

  const handleTileLayerChange = (layerKey) => {
    setCurrentTileLayer(layerKey);
  };

  return (
    <div className="tile-layer-switcher">
      {Object.keys(tileLayers).map((key) => (
        <button
          key={key}
          onClick={() => handleTileLayerChange(key)}
          className={currentTileLayer === key ? "active" : ""}
        >
          {tileLayers[key].name}
        </button>
      ))}
      <TileLayer
        key={currentTileLayer}
        attribution={tileLayers[currentTileLayer].attribution}
        url={tileLayers[currentTileLayer].url}
      />
      {shipData.map((ship) => (
        <Marker key={ship.id} position={[ship.lat, ship.lon]} icon={shipIcon}>
          <Popup>
            <div className="ship-details-card">
              <div className="header">
                <div className="flag-name">
                  <span className="flag">🇵🇦</span>
                  <span className="vessel-name">PVT SUNRISE</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                  <div className="subheader">
                    <span className="vessel-type">Oil/Chemical Tanker</span>
                  </div>
                  <div className="image-section">
                    <div className="image-container">
                      <img
                        src={ship?.image} // Replace with the actual image URL
                        alt="PVT SUNRISE Ship"
                        className="ship-image"
                      />
                      <div className="photos-overlay">
                        <span className="photos-icon">📷</span>
                        <span className="photos-text">Photos:</span>
                        <span className="photos-count">72</span>
                        <span className="arrow-right">❯</span>
                      </div>
                    </div>
                    <button className="vessel-details-button">
                      Vessel details
                    </button>
                  </div>
                </div>
                <div>
                  <div className="navigation-status">
                    <div className="status-label">Navigational status:</div>
                    <div className="status-value">
                      <strong>Underway</strong>
                      <br />
                      Using Engine
                    </div>
                  </div>
                  <div className="speed-course">
                    <div className="speed-label">Speed/Course:</div>
                    <div className="speed-value">11.1kn / 257°</div>
                  </div>
                  <div className="draught">
                    <div className="draught-label">Draught:</div>
                    <div className="draught-value">9.9m</div>
                  </div>
                </div>
              </div>

              <div className="received-info">
                Received: <strong>23 hours, 11 minutes ago</strong> (AIS
                source:)
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </div>
  );
};

const MapComponent = () => {
  const mapRef = useRef(null);
  const latitude = 51.505;
  const longitude = -0.09;

  return (
    <div className="map-container-wrapper">
      <MapContainer
        center={[latitude, longitude]}
        zoom={4}
        ref={mapRef}
        style={{ height: "80vh", width: "80vw" }}
        maxBoundsViscosity={0.9}
      >
        <ChangeTileLayer />
        
      </MapContainer>
    </div>
  );
};

export default MapComponent;
