
export default function Contact() {
  return (
    <section id="contact" className="section bg-black text-white">
      <div className="container max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold">Contact</h2>
        <p className="mt-3 text-gray-300">Siap berdiskusi tentang project baru? Hubungi saya di:</p>
        <div className="mt-6 grid gap-3">
          <a href="mailto:ilhamsandisaputra3@gmail.com" className="rounded-2xl border border-white/20 px-4 py-3 hover:bg-white/10">ilhamsandisaputra3@gmail.com</a>
          <a href="https://instagram.com/USERNAME_MU" className="rounded-2xl border border-white/10 px-4 py-3 hover:bg-white/10">Instagram</a>
          <a href="https://www.linkedin.com/in/USERNAME_MU" className="rounded-2xl border border-white/10 px-4 py-3 hover:bg-white/10">LinkedIn</a>
          <a href="https://www.behance.net/USERNAME_MU" className="rounded-2xl border border-white/10 px-4 py-3 hover:bg-white/10">Behance</a>
        </div>
      </div>
    </section>
  )
}
