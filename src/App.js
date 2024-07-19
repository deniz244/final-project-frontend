import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import axios from "axios";
import * as XLSX from "xlsx";
import "./App.css";
import atmData from "./data/atmData.json";
import LoadingScreen from "./components/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPerson } from "@fortawesome/free-solid-svg-icons";

const TOKEN = process.env.REACT_APP_TOKEN;

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the Earth in meters
  //calculate the difference in latitude and longitude between the two points, converted from degrees to radians.
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  //calculate the square of half the chord length between the points
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); //angular distance in radians
  return R * c;
}

function App() {
  const [viewport, setViewport] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
    zoom: 7,
    bearing: 0,
    pitch: 0,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (userLocation) {
      const distances = atmData.map((atm) => {
        const distance = haversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          atm.latitude,
          atm.longitude
        );
        return { ...atm, distance: Math.round(distance) };
      });

      distances.sort((a, b) => a.distance - b.distance);
      const nearestATMs = distances.slice(0, 10);

      const worksheet = XLSX.utils.json_to_sheet(nearestATMs);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Nearest ATMs");
      XLSX.writeFile(workbook, "nearest_atms.xlsx");
      console.log("Excel file created with nearest ATMs:", nearestATMs);
    }
  }, [userLocation]);

  if (loading) {
    return <LoadingScreen />;
  }

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
              style={{ color: "blue", fontSize: "30px" }}
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
