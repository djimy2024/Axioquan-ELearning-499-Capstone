import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check } from "lucide-react"

export function ComponentShowcase() {
  return (
    <section className="section bg-surface/30">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12 text-center">Component Library</h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cards</h3>
            <Card className="card-hover">
              <h4 className="font-semibold mb-2">Card Title</h4>
              <p className="text-foreground-muted text-sm mb-4">
                Elegant card component with hover effects and flexible content.
              </p>
              <div className="flex gap-2">
                <Badge>React</Badge>
                <Badge variant="secondary">Component</Badge>
              </div>
            </Card>
          </div>

          {/* Buttons */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Buttons</h3>
            <div className="card card-hover space-y-3">
              <Button variant="primary" className="w-full">
                Primary Button
              </Button>
              <Button variant="secondary" className="w-full">
                Secondary Button
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Outline Button
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Badges</h3>
            <div className="card card-hover space-y-4">
              <div className="space-y-2">
                <Badge>Default</Badge>
              </div>
              <div className="space-y-2">
                <Badge variant="success">Success</Badge>
              </div>
              <div className="space-y-2">
                <Badge variant="error">Error</Badge>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Alerts</h3>
            <div className="card card-hover space-y-4">
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Info Alert</AlertTitle>
                <AlertDescription>This is an informational alert with helpful content.</AlertDescription>
              </Alert>
              <Alert variant="success">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Operation completed successfully!</AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Status Indicators */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Status</h3>
            <div className="card card-hover space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-sm">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-error" />
                <span className="text-sm">Inactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
