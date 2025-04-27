import { useState, useEffect } from 'react' // Import useEffect
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // State for the counter (keeping the default Vite template stuff)
  const [count, setCount] = useState(0)
  // State to store the message received from the API
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  // State to store any potential error during the fetch
  const [error, setError] = useState<string | null>(null);


  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Define an async function inside useEffect to perform the fetch
    const fetchApiMessage = async () => {
      try {
        // Make the GET request to our backend API endpoint.
        // IMPORTANT: Use the relative path '/api/hello'.
        // Vite's proxy (configured in vite.config.js) will forward this
        // to your ASP.NET Core backend during development.
        const response = await fetch('/api/test');

        if (!response.ok) {
          // If the response status is not OK (e.g., 404, 500), throw an error
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the response body as text
        const data = await response.text();

        // Update the state with the received message
        setApiMessage(data);
        setError(null); // Clear any previous errors

      } catch (e) {
        // Handle errors (network errors, errors thrown above)
        console.error("Error fetching API message:", e);
        if (e instanceof Error) {
          setError(`Failed to fetch message: ${e.message}`);
        } else {
          setError("An unknown error occurred.");
        }
        setApiMessage(null); // Clear any previous message
      }
    };

    // Call the async function
    fetchApiMessage();

  }, []); // The empty dependency array [] means this effect runs only once on mount


  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + API Call</h1> {/* Updated title */}

      {/* Display API message or loading/error state */}
      <div className="card" style={{ padding: '1rem', margin: '1rem 0', border: '1px solid #eee' }}>
        <h2>Message from /api/test:</h2>
        {error ? (
          <p style={{ color: 'red' }}>Error: {error}</p>
        ) : apiMessage !== null ? (
          <p><strong>{apiMessage}</strong></p>
        ) : (
          <p>Loading message...</p>
        )}
      </div>

      {/* Default Vite counter */}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
