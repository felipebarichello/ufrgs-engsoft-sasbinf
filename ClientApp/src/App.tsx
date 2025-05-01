// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";\
import { Link } from "react-router-dom";
import "./App.css";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Home (App.tsx)</Link>
        <Link to="/react">React Example</Link>
      </nav>
      
      <AppRouter />
    </>
  );
}

export default App;
