import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global Error Trap
window.onerror = function(message, source, lineno, _colno, error) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.innerHTML = `
            <div style="color: #ff5555; text-align: left; max-width: 800px; padding: 20px; border: 1px solid #ff5555; background: #110000;">
                <h3 style="margin-top:0">CRITICAL BOOT FAILURE</h3>
                <p><strong>Msg:</strong> ${message}</p>
                <p><strong>File:</strong> ${source}:${lineno}</p>
                <p><strong>Stack:</strong> ${error?.stack || 'No stack'}</p>
            </div>
        `;
        loader.style.animation = 'none';
    }
};

try {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error("Root element not found");

    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
} catch (e: any) {
    // Manually trigger error handler if render fails
    if(window.onerror) (window.onerror as any)(e.message, 'main.tsx', 0, 0, e);
}
