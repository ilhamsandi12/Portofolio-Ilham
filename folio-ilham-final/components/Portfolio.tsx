
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const items = [
  { title: 'Project 1 – Living Room', image: '/images/p1.jpg' },
  { title: 'Project 2 – Kitchen', image: '/images/p2.jpg' },
  { title: 'Project 3 – Exterior Villa', image: '/images/p3.jpg' },
  { title: 'Project 4 – Bedroom', image: '/images/p4.jpg' },
  { title: 'Project 5 – Lobby', image: '/images/p5.jpg' },
  { title: 'Project 6 – Office', image: '/images/p6.jpg' },
]

export default function Portfolio() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    gsap.fromTo(gridRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' } })
  }, [])

  return (
    <section id="portfolio" className="section bg-zinc-950 text-white">
      <div className="container">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">Portfolio</h2>
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <figure key={i} className="group overflow-hidden rounded-2xl border border-white/10">
              <div className="relative h-56">
                <Image src={it.image} alt={it.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <figcaption className="p-3 text-sm text-gray-300">{it.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
