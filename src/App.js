import "mapbox-gl/dist/mapbox-gl.css";
import React, { /*useEffect*/ useState } from "react";
import ReactMapGL, { NavigationControl } from "react-map-gl";

const TOKEN = process.env.REACT_APP_TOKEN;

function App() {
  const [viewport, setViewport] = useState({
    latitude: 39.872023,
    longitude: 32.850847,
    zoom: 10,
    bearing: 0,
    pitch: 0,
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxAccessToken={TOKEN}
        //transitionDuration="200"
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={(evt) => setViewport(evt.viewState)}
      >
        <NavigationControl position="top-left" />
      </ReactMapGL>
    </div>
  );
}

export default App;
