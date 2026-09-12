import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Materials", href: "/materials" },
    { name: "Projects", href: "/projects" },
    { name: "AI Visualizer", href: "/visualizer" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contact", href: "/contact" },
  ],
  materials: [
    { name: "Marble", href: "/materials?category=marble" },
    { name: "Granite", href: "/materials?category=granite" },
    { name: "Porcelain Tiles", href: "/materials?category=porcelain" },
    { name: "Onyx", href: "/materials?category=onyx" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-gold tracking-wider">
                  INFINITY
                </span>
                <span className="text-xs tracking-[0.3em] text-muted-foreground">
                  MARBLE DESIGN
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium marble, granite, and porcelain tiles trading company serving Qatar since 2009.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Materials</h3>
            <ul className="space-y-3">
              {navigation.materials.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+97450256775"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  +974 5025 6775
                </a>
              </li>
              <li>
                <a
                  href="mailto:infinitymarbledesign@gmail.com"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  <Mail className="h-4 w-4 text-gold" />
                  infinitymarbledesign@gmail.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-gold mt-0.5" />
                  <span>Doha, Qatar</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Infinity Marble Design. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
