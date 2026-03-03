import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1a0101] text-white py-24 border-t border-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Hotel Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="font-heading text-3xl font-bold mb-8 tracking-tighter">
              CHIBEN
              <span className="text-secondary block text-sm tracking-[0.4em] mt-1">LEISURE HOTELS</span>
            </div>
            <p className="text-white/60 mb-8 leading-relaxed font-sans text-sm">
              An unconventional boutique sanctuary in the heart of Awka. We redefine luxury through intimate service and meticulously curated spaces.
            </p>
            <div className="flex space-x-6">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-white/40 hover:text-secondary transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Selection */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-8">Navigation</h3>
            <ul className="space-y-4">
              {['Rooms', 'Facilities', 'Gallery'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-8">Experience</h3>
            <ul className="space-y-4">
              {['Bespoke Service', 'Spa', 'Hall'].map((item) => (
                <li key={item}>
                  <span className="text-white/70 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-8">Connect</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-white/70 text-sm leading-relaxed">
                  41 Regina Caeli Road, Awka, Anambra State, Nigeria
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-white/70 text-sm">+234 901 533 3488</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-white/70 text-sm">info@chibenhotels.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-[10px] uppercase tracking-widest leading-loose">
            © 2025 Chiben Leisure Hotels Limited. <br className="md:hidden" /> Crafted for the discerning traveler.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/20 text-[10px] uppercase tracking-widest">Designed by</span>
            <a
              href="https://jubileesys.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold border-b border-transparent hover:border-white"
            >
              Jubilee Systems
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
