'use client'

import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"
import { usePathname } from 'next/navigation'

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navigation = [
        { name: "Home", href: "/" },
        { name: "Rooms", href: "/rooms" },
        { name: "Facilities", href: "/facilities" },
        { name: "Gallery", href: "/gallery" },
    ]


    const pathname = usePathname()

    return (
        <header className='bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50'>
            {/* Top Bar with Contact Information */}
            <div className='bg-primary text-primary-foreground py-2 border-b border-white/10'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className='flex justify-between items-center text-xs tracking-widest uppercase'>
                        <div className="flex items-center gap-6">
                            <div className='flex items-center gap-2 hover:text-secondary transition-colors'>
                                <Phone className="h-3 w-3" />
                                <span>+234 901 533 3488</span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <span>Boutique Luxury in the Heart of Awka</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center py-6'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center hover:opacity-90 transition-opacity'>
                        <Image
                            src={'/images/logo/Logo.png'}
                            alt="Chiben Leisure Hotels"
                            width="140"
                            height='70'
                            className="object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-foreground hover:text-primary transition-all duration-300 font-medium text-sm tracking-wide uppercase font-sans",
                                    pathname === item.href && "text-primary border-b border-primary pb-1"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    {/* <div className="hidden lg:flex items-center gap-4">
                        <Button asChild className="rounded-none px-8 border-primary hover:bg-primary-foreground hover:text-primary border transition-all">
                            <Link href='/booking'>Book Now</Link>
                        </Button>
                    </div> */}

                    {/* Mobile menu button */}
                    <button className='lg:hidden p-2 text-primary' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden py-6 border-t border-border animate-in fade-in slide-in-from-top-4 duration-300">
                        <nav className="flex flex-col space-y-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "text-foreground hover:text-primary transition-colors duration-200 font-medium py-2 uppercase tracking-widest text-sm",
                                        pathname === item.href && "text-primary pl-4 border-l-2 border-primary"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>

        </header>
    )
}

export default Navbar