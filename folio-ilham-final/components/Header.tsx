
import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
      <nav className="container flex items-center justify-between py-3">
        <a href="#" className="text-white font-semibold tracking-wide">Ilham Sandi</a>
        <div className="space-x-6 text-sm">
          <a href="#about" className="text-gray-200 hover:text-white">About</a>
          <a href="#portfolio" className="text-gray-200 hover:text-white">Portfolio</a>
          <a href="#contact" className="text-gray-200 hover:text-white">Contact</a>
        </div>
      </nav>
    </header>
  )
}
