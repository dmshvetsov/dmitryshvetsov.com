import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './theme.css'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5b8c00',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
