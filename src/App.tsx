import { useEffect, useState } from 'react'
import { createClient } from '@blinkdotnew/sdk'
import Header from './components/Header'
import ServicesMenu from './components/ServicesMenu'
import Footer from './components/Footer'
import { TelegramWebApp } from './types/telegram'

// Initialize Blink SDK
const blink = createClient({
  projectId: 'ai-noreira-telegram-mini-app-fyq3qbfo',
  authRequired: false // For Telegram mini-app, we'll handle auth differently
})

// Declare Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

function App() {
  const [telegramUser, setTelegramUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      
      // Set theme
      tg.setHeaderColor('#FCF9F4')
      tg.setBackgroundColor('#FCF9F4')
      
      // Get user data
      if (tg.initDataUnsafe?.user) {
        setTelegramUser(tg.initDataUnsafe.user)
      }
      
      setIsLoading(false)
    } else {
      // For development/testing outside Telegram
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="telegram-viewport bg-background">
      <div className="min-h-full flex flex-col">
        <Header telegramUser={telegramUser} />
        <main className="flex-1">
          <ServicesMenu />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App