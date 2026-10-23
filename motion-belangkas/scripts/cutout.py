"""Unduh aset gambar Higgsfield lalu jadikan potongan kertas (latar putih dibuang, tepi krem).

  python3 scripts/cutout.py

Membaca scripts/assets.json ({nama: url}), menulis public/img/<nama>.png dan src/Short/assets.json.
"""
import io
import json
import os
import urllib.request

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CREAM = (239, 230, 210)
MAX = 1400


def cutout(img: Image.Image) -> Image.Image:
    img = img.convert('RGB')
    img.thumbnail((MAX, MAX))
    arr = np.asarray(img).astype(np.int16)
    white = (arr.min(axis=2) > 228) & (np.ptp(arr, axis=2) < 24)
    flood = Image.fromarray(np.where(white, 255, 0).astype(np.uint8), 'L').copy()
    w, h = flood.size
    for x in range(0, w, 8):
        for y in (0, h - 1):
            if flood.getpixel((x, y)) == 255:
                ImageDraw.floodfill(flood, (x, y), 128)
    for y in range(0, h, 8):
        for x in (0, w - 1):
            if flood.getpixel((x, y)) == 255:
                ImageDraw.floodfill(flood, (x, y), 128)
    fg = Image.fromarray(np.where(np.asarray(flood) == 128, 0, 255).astype(np.uint8), 'L')
    fg = fg.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    border = fg.filter(ImageFilter.MaxFilter(27)).filter(ImageFilter.GaussianBlur(1.2))
    out = Image.new('RGBA', img.size, CREAM + (0,))
    out.putalpha(border)
    photo = img.convert('RGBA')
    photo.putalpha(fg)
    out.alpha_composite(photo)
    pad = Image.new('RGBA', (w + 60, h + 60), (0, 0, 0, 0))
    pad.alpha_composite(out, (30, 30))
    return pad.crop(pad.getbbox())


def main():
    src = json.load(open(os.path.join(ROOT, 'scripts', 'assets.json')))
    manifest = {}
    for name, url in src.items():
        data = urllib.request.urlopen(url, timeout=60).read()
        piece = cutout(Image.open(io.BytesIO(data)))
        piece.save(os.path.join(ROOT, 'public', 'img', f'{name}.png'), optimize=True)
        manifest[name] = list(piece.size)
        print(name, piece.size)
    json.dump(manifest, open(os.path.join(ROOT, 'src', 'Short', 'assets.json'), 'w'), indent=2)


if __name__ == '__main__':
    main()
