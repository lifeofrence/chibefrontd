import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-primary/10 text-[12rem] font-heading font-bold italic leading-none select-none">
          404
        </div>
        <h1 className="font-heading text-3xl font-bold text-primary italic mt-4 mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full bg-primary text-white hover:bg-secondary hover:text-primary">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
