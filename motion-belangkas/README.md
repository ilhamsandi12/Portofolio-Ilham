# Short — Belangkas (Remotion)

Video vertikal 9:16 (1080×1920, 30 fps, 68 detik) tentang **kenapa belangkas bisa bertahan 445 juta tahun
melewati kepunahan massal, dan kenapa bentuknya nggak berubah**. Gaya visual: editorial collage
(serif besar, potongan cetak halftone, coretan tangan, grain film) mengikuti referensi motion.

## Alur
| Detik | Adegan | Isi |
|---|---|---|
| 0–7.5 | Hook | Hitung ke 445, Bumi "di-reset", belangkas selalu lolos |
| 7.5–13.8 | Intro | Bukan kepiting, kerabatnya laba-laba & kalajengking |
| 13.8–21.9 | The Great Dying | 252 juta tahun lalu, ±90% spesies laut lenyap, belangkas "tetap jalan" 😎 |
| 21.9–35.1 | Rahasia | Makan apa aja, tahan banting, cangkang + darah biru, telur ribuan |
| 35.1–43.9 | Evolusi | Sebenarnya berevolusi: genom menggandakan diri 3× |
| 43.9–53.2 | Pohon | Kerabat air tawar berubah bentuk lalu punah; desain lama pas dengan dasar laut dangkal |
| 53.2–55.5 | Punchline | "Kalau nggak rusak, ngapain diganti?" |
| 55.5–68 | Penutup | Ancaman terbesarnya: kita. Dilindungi di Indonesia, kalau ketemu lepasin |

## Jalankan
```bash
npm install
npm run dev      # Remotion Studio
npm run render   # out/belangkas.mp4
```

## Audio
- `public/audio/vo.mp3`: VO ElevenLabs (voice "Vivan"), dipercepat 1.1× dan dinormalisasi.
- `src/Short/words.ts`: timestamp per kata dari transkrip VO. Semua animasi, caption, SFX, dan
  bagian musik dikunci ke indeks kata di `src/Short/timing.ts`.
- `public/audio/music.mp3` + `ambience.mp3`: dikomposisi oleh `scripts/compose_music.py` (numpy),
  mengikuti timing VO. Kalau VO diganti: perbarui `words.ts`, lalu `python3 scripts/compose_music.py public/audio`
  dan konversi WAV ke MP3.
- `public/audio/sfx/`: SFX ElevenLabs (boom, whoosh, glitch, rumble, pop, shimmer, record scratch).

Mau pakai musik lain? Timpa `public/audio/music.mp3` (durasi ≥ 68 detik); volumenya otomatis turun saat narator bicara.

## Fakta & sumber
- Fosil tertua: *Lunataspis aurora*, ±445 juta tahun (Ordovisium).
- Kepunahan Perm–Trias ("The Great Dying"), 252 juta tahun lalu.
- Kolonisasi air tawar & inovasi bentuk: Lamsdell 2016, *Palaeontology* 59(2).
- Tiga putaran duplikasi genom: genom *Carcinoscorpius rotundicauda* (Nature Communications 2020) dan *Limulus polyphemus*.
- Dilindungi di Indonesia: Permen LHK P.106/2018.
