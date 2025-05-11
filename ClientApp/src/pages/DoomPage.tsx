function DoomPage() {
  return (
    <>
        <iframe
            src="https://doomonline1.vercel.app/finaldoom/index.html"
            title="Doom"
            style={{
                width: '100vw',
                height: '40vw',
                border: 'none'   // Optional: Remove the default iframe border for a fullscreen feel
            }}
        >
            {/* Content for browsers that don't support iframes (optional) */}
            <p>Your browser does not support iframes.</p>
        </iframe>
        <style>
            {`
                #root {
                    max-width: 100vw; // Set max width to 100% of the viewport width
                }
            `}
        </style>
    </>
  );
}

export default DoomPage;