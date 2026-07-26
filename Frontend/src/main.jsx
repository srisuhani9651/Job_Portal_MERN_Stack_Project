import React from 'react' // Added React import
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'
import './index.css'
import store from './Redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
    <Toaster/>
  </React.StrictMode>
)
 