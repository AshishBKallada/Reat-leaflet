import "./App.css";
import MapComponent from "./components/Map";

function App() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {" "}
      {/* Use 100vh for full viewport height */}
      <MapComponent />
    </div>
  );
}

export default App;
