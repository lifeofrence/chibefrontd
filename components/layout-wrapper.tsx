'use client'

import { usePathname } from 'next/navigation'

interface LayoutWrapperProps {
    children: React.ReactNode
    navbar: React.ReactNode
    footer: React.ReactNode
}

export default function LayoutWrapper({ children, navbar, footer }: LayoutWrapperProps) {
    const pathname = usePathname()
    // Hide navbar/footer on admin pages
    const isAdmin = pathname?.startsWith('/admin')

    return (
        <>
            {!isAdmin && navbar}
            {children}
            {!isAdmin && footer}
        </>
    )
}
