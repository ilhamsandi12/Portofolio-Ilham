"""Tekstur grain film + kertas untuk overlay gaya collage.

  python3 scripts/make_textures.py public/tex
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

out = sys.argv[1] if len(sys.argv) > 1 else '.'
rng = np.random.default_rng(3)

# Grain: beberapa frame noise abu-abu yang diputar bergantian di video
for i in range(6):
    n = rng.normal(128, 38, (960, 540)).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(n, 'L').filter(ImageFilter.GaussianBlur(0.6))
    img.save(os.path.join(out, f'grain{i}.png'), optimize=True)

# Kertas: krem dengan noise frekuensi rendah + serat halus
h, w = 1920, 1080
base = np.array([236, 227, 207], dtype=np.float32)
low = np.array(Image.fromarray(rng.normal(128, 60, (h // 24, w // 24)).clip(0, 255).astype(np.uint8))
               .resize((w, h), Image.BICUBIC), dtype=np.float32) - 128
fine = rng.normal(0, 7, (h, w))
fibers = np.zeros((h, w), dtype=np.float32)
for _ in range(900):
    y, x = rng.integers(0, h), rng.integers(0, w)
    length, ang = rng.integers(8, 40), rng.random() * np.pi
    for t in range(length):
        yy, xx = int(y + np.sin(ang) * t), int(x + np.cos(ang) * t)
        if 0 <= yy < h and 0 <= xx < w:
            fibers[yy, xx] -= 18
shade = (low * 0.12 + fine + fibers)[..., None]
paper = (base + shade).clip(0, 255).astype(np.uint8)
Image.fromarray(paper, 'RGB').filter(ImageFilter.GaussianBlur(0.4)).save(os.path.join(out, 'paper.jpg'), quality=88)
print('textures ->', out)
