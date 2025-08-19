
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3')
      .fromTo(ctaRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.2')
  }, [])

  return (
    <section className="section bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white">
      <div className="container text-center">
        <h1 ref={titleRef} className="text-4xl sm:text-6xl font-bold tracking-tight">
          3D Artist & Architectural Visualizer
        </h1>
        <p ref={subtitleRef} className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Saya membantu arsitek & brand menampilkan ide menjadi visual 3D yang fotorealistik.
        </p>
        <a ref={ctaRef} href="#portfolio" className="inline-block mt-8 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20">
          Lihat Karya
        </a>
      </div>
    </section>
  )
}
