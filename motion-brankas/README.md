# Motion — Brankas (Remotion)

Animasi motion graphic brankas: pintu besi masuk, dial kode diputar (27 – 08 – 64),
pengunci dilepas, pintu terbuka dan memperlihatkan emas yang bersinar.

- 1920×1080, 30 fps, 12 detik (`Brankas`)
- Font Space Grotesk & JetBrains Mono disimpan lokal di `public/fonts` (lisensi OFL)

## Jalankan
```bash
npm install
npm run dev      # buka Remotion Studio untuk preview & edit
npm run render   # hasil ke out/brankas.mp4
```

## Edit
- Kode brankas, warna, dan timing tiap babak: `src/Brankas/timeline.ts`
- Teks judul & caption: `src/Brankas/TextPanel.tsx`
- Pintu, dial, roda kunci: `src/Brankas/Door.tsx`, `src/Brankas/Dial.tsx`
- Isi brankas (emas, cahaya, partikel): `src/Brankas/Vault.tsx`
