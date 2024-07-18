import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import atmData from "./data/atmData.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPerson } from "@fortawesome/free-solid-svg-icons";

const TOKEN = process.env.REACT_APP_TOKEN;

function App() {
  const [viewport, setViewport] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
    zoom: 7,
    bearing: 0,
    pitch: 0,
  });

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setViewport((prevViewport) => ({
          ...prevViewport,
          latitude,
          longitude,
          zoom: 12,
        }));
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxAccessToken={TOKEN}
        transitionDuration="200"
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={(evt) => setViewport(evt.viewState)}
      >
        <NavigationControl position="top-left" />
        {userLocation && (
          <Marker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
          >
            <FontAwesomeIcon
              icon={faPerson}
              style={{ color: "blue", fontSize: "40px" }}
            />
          </Marker>
        )}
        {atmData.map((atm) => (
          <Marker
            key={atm.atmId}
            latitude={atm.latitude}
            longitude={atm.longitude}
          >
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={{ color: "red", fontSize: "24px" }}
            />
          </Marker>
        ))}
      </ReactMapGL>
    </div>
  );
}

export default App;
