import { MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <a 
            href="https://t.me/AinoReira" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Send me a message on Telegram @AinoReira</span>
          </a>
        </div>
      </div>
    </footer>
  )
}