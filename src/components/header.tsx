"use client"

import { Button } from "../components/ui/button"
import { Zap } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AxioQuan</span>
        </div>
        <nav className="hidden gap-6 md:flex">
          <a href="#" className="text-sm hover:text-primary transition-colors">
            Components
          </a>
          <a href="#" className="text-sm hover:text-primary transition-colors">
            Docs
          </a>
          <a href="#" className="text-sm hover:text-primary transition-colors">
            About
          </a>
        </nav>
        <Button variant="primary">Get Started</Button>
      </div>
    </header>
  )
}
