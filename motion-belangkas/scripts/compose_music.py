"""Komposisi musik latar + ambience bawah laut untuk short Belangkas.

Semua bagian lagu dikunci ke timestamp kata di src/Short/words.ts, jadi kalau VO
diganti, cukup generate ulang words.ts lalu jalankan skrip ini lagi.

  python3 scripts/compose_music.py public/audio
"""
import os
import re
import sys
import wave

import numpy as np

SR = 44100
BPM = 95
BEAT = 60 / BPM
BAR = BEAT * 4
VO_START = 0.2
DURATION = 68.0

rng = np.random.default_rng(7)

HERE = os.path.dirname(os.path.abspath(__file__))
WORDS = [float(s) + VO_START for s in re.findall(
    r'start: ([\d.]+)', open(os.path.join(HERE, '..', 'src', 'Short', 'words.ts')).read())]

A_RESET = WORDS[10]
A_INTRO = WORDS[16]
A_DYING = WORDS[26]
A_JALAN = WORDS[44]
A_EVOLVE = WORDS[73]
A_SEBENARNYA = WORDS[78]
A_BRANCH = WORDS[90]
A_PUNCH = WORDS[114]
A_OUTRO = WORDS[119]
A_KITA = WORDS[129]

N = int(DURATION * SR)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def fft_band(x, lo=0.0, hi=None):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    mask = np.ones_like(f)
    if lo:
        mask *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        mask *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * mask, len(x))


class Bus:
    def __init__(self):
        self.l = np.zeros(N)
        self.r = np.zeros(N)

    def add(self, at, sig, gain=1.0, pan=0.0):
        i = int(at * SR)
        if i >= N or i + len(sig) <= 0:
            return
        sig = sig[: N - i] * gain
        self.l[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2) * np.sqrt(2)
        self.r[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2) * np.sqrt(2)


def adsr(n, a=0.005, r=0.05):
    e = np.ones(n)
    na, nr = min(int(a * SR), n), min(int(r * SR), n)
    e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


# ---------- instrumen ----------

def pluck(f, dur=0.7):
    t = t_axis(dur)
    s = sum((1 / k ** 1.3) * np.sin(2 * np.pi * k * f * t) * np.exp(-t * (4 + k * 2.5)) for k in range(1, 7))
    return s * adsr(len(t), 0.003, 0.05)


def pad(notes, dur, bright=5):
    t = t_axis(dur)
    s = np.zeros(len(t))
    for m in notes:
        for cents in (-7, 0, 7):
            f = hz(m) * 2 ** (cents / 1200)
            s += sum((1 / k ** 1.6) * np.sin(2 * np.pi * k * f * t + rng.random() * 6) for k in range(1, bright + 1))
    return s / (len(notes) * 3) * adsr(len(t), min(0.9, dur / 3), min(1.0, dur / 3))


def piano(f, dur=3.0):
    t = t_axis(dur)
    s = sum((1 / k ** 1.4) * np.sin(2 * np.pi * f * k * np.sqrt(1 + 0.0004 * k * k) * t) * np.exp(-t * (1.1 + k * 0.9))
            for k in range(1, 9))
    click = fft_band(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 300) * 0.05
    return (s + click) * adsr(len(t), 0.002, 0.3)


def kick():
    t = t_axis(0.5)
    f = 45 + 85 * np.exp(-t * 32)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 400) * 0.2


def clap():
    t = t_axis(0.3)
    env = sum(np.exp(-np.maximum(t - d, 0) * 40) * (t >= d) for d in (0, 0.012, 0.024))
    return fft_band(rng.standard_normal(len(t)), 900, 5000) * env * 0.6


def hat(open_=False):
    t = t_axis(0.25 if open_ else 0.06)
    return fft_band(rng.standard_normal(len(t)), 7000) * np.exp(-t * (18 if open_ else 70))


def bass808(f, dur):
    t = t_axis(dur + 0.15)
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.25 * np.exp(-t * 25))) / SR
    s = np.tanh(1.8 * np.sin(ph) * np.exp(-t * 1.2))
    return s * adsr(len(t), 0.004, 0.15)


def pulse_bass(f):
    t = t_axis(0.22)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 14)


def tick():
    t = t_axis(0.05)
    return np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 160) + 0.5 * np.sin(2 * np.pi * 1300 * t) * np.exp(-t * 90)


def tom(f):
    t = t_axis(0.6)
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 18))) / SR
    return np.sin(ph) * np.exp(-t * 6)


def string_stab(f, dur):
    t = t_axis(dur)
    s = sum((1 / k) * np.sin(2 * np.pi * k * f * t + k) for k in range(1, 11))
    return s * adsr(len(t), 0.008, 0.04) * 0.35


def riser(dur):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    hop = 2048
    for i in range(0, n, hop):
        p = i / n
        seg = noise[i:i + hop * 2]
        c = 300 + 6000 * p ** 2
        out[i:i + len(seg)] += fft_band(seg, c * 0.6, c * 1.6) * np.hanning(len(seg))
    t = np.arange(n) / SR
    sweep = np.sin(2 * np.pi * np.cumsum(120 + 900 * (t / dur) ** 2) / SR) * 0.3
    return (out * 0.8 + sweep) * (t / dur) ** 2.2


def sub_drone(dur):
    t = t_axis(dur)
    lfo = 0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t)
    s = np.sin(2 * np.pi * hz(26) * t) + 0.6 * np.sin(2 * np.pi * hz(38) * t) + 0.15 * np.sin(2 * np.pi * hz(45) * t)
    return s * lfo * adsr(len(t), 1.2, 1.5)


# ---------- aransemen ----------

CHORDS = {
    'Dm': ([50, 53, 57], 38),
    'Bb': ([46, 50, 53], 34),
    'F': ([53, 57, 60], 41),
    'C': ([48, 52, 55], 36),
    'Gm': ([55, 58, 62], 43),
    'A': ([45, 49, 52], 33),
}
GROOVE = ['Dm', 'Bb', 'F', 'C']
ARP = [0, 1, 2, 1, 2, 0, 1, 2]

dry, wet, drums = Bus(), Bus(), Bus()


def bars(start, end):
    t, i = start, 0
    while t < end - 0.05:
        yield i, t
        t += BAR
        i += 1


def groove(start, end, kick_pattern=(0, 1.5, 2), hats=True, arp_oct=12, arp_gain=0.16, bass=True):
    for i, t in bars(start, end):
        notes, root = CHORDS[GROOVE[i % 4]]
        wet.add(t, pad(notes, min(BAR, end - t) + 0.4), 0.10)
        for b in kick_pattern:
            if t + b * BEAT < end:
                drums.add(t + b * BEAT, kick(), 0.55)
        for b in (1, 3):
            if t + b * BEAT < end:
                wet.add(t + b * BEAT, clap(), 0.22)
        if hats:
            for h in range(8):
                if t + h * BEAT / 2 < end:
                    drums.add(t + h * BEAT / 2, hat(open_=h == 7), 0.05 if h % 2 else 0.03, pan=0.3)
        if bass:
            drums.add(t, bass808(hz(root), BEAT * 1.4), 0.22)
            if t + 2.5 * BEAT < end:
                drums.add(t + 2.5 * BEAT, bass808(hz(root), BEAT * 1.2), 0.18)
        for s in range(8):
            at = t + s * BEAT / 2
            if at < end:
                wet.add(at, pluck(hz(notes[ARP[s]] + arp_oct)), arp_gain, pan=-0.35 if s % 2 else 0.35)


# A. Hook: drone, detak jam, pad gelap
wet.add(0, sub_drone(A_DYING + 0.5), 0.12)
wet.add(0, pad([50, 57], A_INTRO + 0.6, bright=3), 0.14)
b = 0.35
while b < A_INTRO:
    dry.add(b, tick(), 0.12 if int((b - 0.35) / BEAT) % 4 else 0.2, pan=0.2)
    b += BEAT

# B. Intro: bass berdenyut + arpeggio penasaran
for i, t in bars(A_INTRO, A_DYING):
    notes, root = CHORDS[['Dm', 'Bb'][i % 2]]
    wet.add(t, pad(notes, BAR + 0.4), 0.09)
    for s in range(8):
        at = t + s * BEAT / 2
        if at < A_DYING:
            drums.add(at, pulse_bass(hz(root)), 0.28)
            if s in (0, 3, 5, 6):
                wet.add(at, pluck(hz(notes[ARP[s]] + 12)), 0.13, pan=0.4 if s % 2 else -0.4)
            drums.add(at, hat(), 0.025, pan=0.3)

# C. The Great Dying: ostinato senar tegang, tom, riser
s = A_DYING
k = 0
while s < A_JALAN - 0.1:
    f = hz(38 if (k // 2) % 2 == 0 else 39)
    grow = 0.5 + 0.5 * (s - A_DYING) / (A_JALAN - A_DYING)
    wet.add(s, string_stab(f, BEAT / 4 * 0.9), 0.35 * grow)
    wet.add(s, string_stab(f * 2, BEAT / 4 * 0.9), 0.12 * grow)
    if k % 4 == 0:
        drums.add(s, tom(hz(38)), 0.45 * grow)
    k += 1
    s += BEAT / 4
wet.add(A_JALAN - 2.4, riser(2.35), 0.32)

# D. "Tetap jalan": groove penuh sampai pertanyaan evolusi
groove(A_JALAN, A_EVOLVE)

# E. Breakdown pertanyaan, lalu kembali pelan dengan arpeggio DNA yang lebih tinggi
for i, t in bars(A_EVOLVE, A_SEBENARNYA):
    notes, _ = CHORDS[GROOVE[i % 4]]
    wet.add(t, pad(notes, BAR + 0.6), 0.12)
    wet.add(t, pluck(hz(notes[2] + 24)), 0.1)
groove(A_SEBENARNYA, A_BRANCH, kick_pattern=(0, 2), arp_oct=24, arp_gain=0.11)

# F. Cabang air tawar: groove penuh lagi
groove(A_BRANCH, A_PUNCH)

# G. Punchline: musik mati total (record scratch dari SFX)

# H. Penutup: piano + pad, lebih emosional
MELODY = [69, 65, 64, 62]
for i, t in bars(A_OUTRO, DURATION - 1.0):
    name = ['Dm', 'Bb', 'Gm', 'A', 'Dm'][min(i, 4)]
    notes, root = CHORDS[name]
    last = i >= 4
    wet.add(t, pad(notes, BAR * (2 if last else 1) + 0.6), 0.1)
    for m in notes:
        wet.add(t, piano(hz(m + 12), 4.5 if last else 3.0), 0.11)
    wet.add(t, piano(hz(root + 12), 4.5 if last else 3.0), 0.14)
    if not last:
        for j, m in enumerate(MELODY[: 3 if i % 2 else 4]):
            wet.add(t + (j + 1) * BEAT * 0.75 + BEAT * 0.5, piano(hz(m + (0 if i < 2 else -2))), 0.12)
    if last:
        break
drums.add(A_KITA, bass808(hz(26), 2.5), 0.4)

# ---------- reverb + master ----------

def reverb(x, seconds=2.2, seed=1):
    t = np.arange(int(seconds * SR)) / SR
    ir = np.random.default_rng(seed).standard_normal(len(t)) * np.exp(-t / 0.45)
    ir = fft_band(ir, 150, 7000)
    ir /= np.sqrt(np.sum(ir ** 2))
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x)]


left = dry.l + wet.l + drums.l + reverb(wet.l, seed=1) * 0.35
right = dry.r + wet.r + drums.r + reverb(wet.r, seed=2) * 0.35

gate = np.ones(N)
t = np.arange(N) / SR
gate[(t > A_RESET + 0.05) & (t < A_RESET + 0.45)] = 0.0
gate[(t > A_JALAN - 0.08) & (t < A_JALAN)] = 0.0
gate[(t > A_PUNCH - 0.02) & (t < A_OUTRO - 0.05)] = 0.0
gate = np.convolve(gate, np.ones(256) / 256, mode='same')
fade = np.clip((DURATION - t) / 2.0, 0, 1)
left, right = fft_band(left, 32), fft_band(right, 32)
master = np.stack([left, right], axis=1) * (gate * fade)[:, None]
master = np.tanh(master / np.max(np.abs(master)) * 1.3) / np.tanh(1.3) * 0.89


def write_wav(path, data):
    pcm = (np.clip(data, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ---------- ambience bawah laut (track terpisah) ----------

def underwater(dur):
    n = int(dur * SR)
    brown = fft_band(rng.standard_normal(n), 25, 320)
    brown /= np.max(np.abs(brown))
    amb = np.stack([brown, np.roll(brown, 9000)], axis=1) * 0.6
    for _ in range(int(dur * 2.5)):
        at = int(rng.random() * (n - SR))
        bt = t_axis(0.06 + rng.random() * 0.08)
        f0 = 250 + rng.random() * 700
        blip = np.sin(2 * np.pi * np.cumsum(f0 * (1 + 2.5 * bt / bt[-1])) / SR) * np.exp(-bt * 45)
        pan = rng.random()
        amb[at:at + len(bt), 0] += blip * 0.25 * (1 - pan)
        amb[at:at + len(bt), 1] += blip * 0.25 * pan
    return amb / np.max(np.abs(amb)) * 0.9


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    write_wav(os.path.join(out, 'music.wav'), master)
    write_wav(os.path.join(out, 'ambience.wav'), underwater(DURATION))
    print('music + ambience ->', out)
