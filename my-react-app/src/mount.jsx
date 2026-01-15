import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

export function mount(el) {
    const root = ReactDOM.createRoot(el)
    root.render(
        <React.StrictMode>
            <div id="my-react-app-root">
                <App />
            </div>
        </React.StrictMode>
    )
    return () => {
        root.unmount()
    }
}
