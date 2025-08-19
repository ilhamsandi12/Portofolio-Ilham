
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current.querySelectorAll('.fadein'),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
  }, [])

  return (
    <section id="about" className="section bg-black text-gray-100">
      <div className="container" ref={ref}>
        <h2 className="fadein text-3xl sm:text-4xl font-semibold">Tentang Ilham</h2>
        <p className="fadein mt-4 max-w-3xl text-gray-300">
          Saya <strong>Ilham Sandi</strong>, 3D Artist & Architectural Visualizer dengan pengalaman 3+ tahun.
          Mengkhususkan diri pada visualisasi <em>interior</em> & <em>eksterior</em>, lighting, dan material.
          Tools: 3ds Max/Blender, V‑Ray/Cycles, Photoshop.
        </p>
        <div className="fadein mt-6 grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 p-4">Fotorealistik</div>
          <div className="rounded-2xl border border-white/10 p-4">Cepat & Tepat</div>
          <div className="rounded-2xl border border-white/10 p-4">Siap untuk Client</div>
        </div>
      </div>
    </section>
  )
}
