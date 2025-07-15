import { ExternalLink } from 'lucide-react'
import { TelegramUser } from '../types/telegram'

interface HeaderProps {
  telegramUser: TelegramUser | null
}

export default function Header({ telegramUser }: HeaderProps) {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-2">
            <a 
              href="https://ainoreira.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <span className="font-semibold text-lg">Dominatrix Aino Reira</span>
              <ExternalLink className="w-4 h-4 opacity-60" />
            </a>
          </div>

          {/* User Info */}
          {telegramUser && (
            <div className="flex items-center space-x-2">
              {telegramUser.photo_url && (
                <img 
                  src={telegramUser.photo_url} 
                  alt={telegramUser.first_name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {telegramUser.first_name} {telegramUser.last_name}
                </p>
                {telegramUser.username && (
                  <p className="text-xs text-muted-foreground">
                    @{telegramUser.username}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}