"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Phone, Mail, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { authClient, useSession } from "@/lib/auth-client"

const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Materials", href: "/materials" },
  { name: "AI Visualizer", href: "/visualizer" },
  { name: "Contact", href: "/contact" },
]

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Projects", href: "/projects" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    setIsOpen(false)
    router.push("/")
    router.refresh()
  }

  const navigation = session?.user
    ? [...publicNavigation, ...adminNavigation]
    : publicNavigation

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-gold tracking-wider lg:text-2xl">
                INFINITY
              </span>
              <span className="text-[10px] tracking-[0.3em] text-muted-foreground lg:text-xs">
                MARBLE DESIGN
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-gold"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Contact */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <a
              href="tel:+97450256775"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>50256775</span>
            </a>
            {session?.user ? (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-gold/40 text-gold hover:bg-gold hover:text-background"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold hover:text-background">
                <Link href="/sign-in">Admin Login</Link>
              </Button>
            )}
            <Button asChild className="bg-gold text-background hover:bg-gold-light">
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-background border-border">
              <div className="flex flex-col gap-6 pt-6">
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-foreground transition-colors hover:text-gold py-2"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-4 pt-6 border-t border-border">
                  <a
                    href="tel:+97450256775"
                    className="flex items-center gap-3 text-muted-foreground hover:text-gold"
                  >
                    <Phone className="h-5 w-5" />
                    <span>50256775</span>
                  </a>
                  <a
                    href="mailto:infinitymarbledesign@gmail.com"
                    className="flex items-center gap-3 text-muted-foreground hover:text-gold"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="text-sm">infinitymarbledesign@gmail.com</span>
                  </a>
                  <Button asChild className="w-full bg-gold text-background hover:bg-gold-light mt-4">
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      Get Quote
                    </Link>
                  </Button>
                  {session?.user ? (
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="w-full border-gold/40 text-gold hover:bg-gold hover:text-background"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-gold/40 text-gold hover:bg-gold hover:text-background"
                    >
                      <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                        Admin Login
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
