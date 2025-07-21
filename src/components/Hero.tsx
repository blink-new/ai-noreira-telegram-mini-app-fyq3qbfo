import { Bot, Sparkles, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Main Hero Content */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-accent/50 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Services</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Welcome to
            <span className="text-primary block">AI Noreira</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Your intelligent assistant for content creation, automation, and digital solutions. 
            Explore our premium AI services designed to enhance your productivity.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Automation</h3>
            <p className="text-sm text-muted-foreground">
              Streamline your workflow with intelligent automation solutions
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Content Creation</h3>
            <p className="text-sm text-muted-foreground">
              Generate high-quality content with advanced AI models
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Fast & Reliable</h3>
            <p className="text-sm text-muted-foreground">
              Lightning-fast processing with 99.9% uptime guarantee
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/20 rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-6">
            Choose from our range of AI services below and experience the future of productivity.
          </p>
          <div className="inline-flex items-center space-x-2 text-primary font-medium">
            <span>Scroll down to explore services</span>
            <div className="animate-bounce">↓</div>
          </div>
        </div>
      </div>
    </section>
  )
}