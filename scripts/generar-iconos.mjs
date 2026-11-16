// genera los iconos pwa en png sin dependencias externas
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const carpeta = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
mkdirSync(carpeta, { recursive: true })

// tabla para el crc32 que pide el formato png
const tablaCrc = (() => {
  const tabla = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    tabla[n] = c >>> 0
  }
  return tabla
})()

function crc32(buffer) {
  let c = 0xffffffff
  for (let i = 0; i < buffer.length; i++) {
    c = tablaCrc[(c ^ buffer[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

// arma un bloque del png (longitud + tipo + datos + crc)
function bloque(tipo, datos) {
  const longitud = Buffer.alloc(4)
  longitud.writeUInt32BE(datos.length)
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(cuerpo))
  return Buffer.concat([longitud, cuerpo, crc])
}

// distancia de un punto a un segmento, para dibujar la palomita
function distanciaSegmento(px, py, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const largo = dx * dx + dy * dy
  let t = ((px - ax) * dx + (py - ay) * dy) / largo
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

// color de cada pixel con muestreo para suavizar bordes
function colorPixel(x, y, tamano) {
  const muestras = 3
  let r = 0
  let g = 0
  let b = 0

  for (let sy = 0; sy < muestras; sy++) {
    for (let sx = 0; sx < muestras; sx++) {
      const px = (x + (sx + 0.5) / muestras) / tamano
      const py = (y + (sy + 0.5) / muestras) / tamano

      // degradado diagonal de indigo claro a indigo fuerte
      const t = (px + py) / 2
      let rojo = 99 + (67 - 99) * t
      let verde = 102 + (56 - 102) * t
      let azul = 241 + (202 - 241) * t

      // palomita blanca al centro
      const d1 = distanciaSegmento(px, py, 0.27, 0.52, 0.44, 0.69)
      const d2 = distanciaSegmento(px, py, 0.44, 0.69, 0.74, 0.34)
      if (Math.min(d1, d2) < 0.055) {
        rojo = 255
        verde = 255
        azul = 255
      }

      r += rojo
      g += verde
      b += azul
    }
  }

  const total = muestras * muestras
  return [Math.round(r / total), Math.round(g / total), Math.round(b / total)]
}

// codifica un png rgba de 8 bits
function crearPng(tamano) {
  const fila = tamano * 4 + 1
  const crudo = Buffer.alloc(fila * tamano)

  for (let y = 0; y < tamano; y++) {
    const base = y * fila
    crudo[base] = 0 // filtro none
    for (let x = 0; x < tamano; x++) {
      const [r, g, b] = colorPixel(x, y, tamano)
      const i = base + 1 + x * 4
      crudo[i] = r
      crudo[i + 1] = g
      crudo[i + 2] = b
      crudo[i + 3] = 255
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(tamano, 0)
  ihdr.writeUInt32BE(tamano, 4)
  ihdr[8] = 8 // bits por canal
  ihdr[9] = 6 // rgba
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloque('IHDR', ihdr),
    bloque('IDAT', deflateSync(crudo, { level: 9 })),
    bloque('IEND', Buffer.alloc(0)),
  ])
}

// se escriben los dos tamanos que pide el manifest
for (const tamano of [192, 512]) {
  const ruta = join(carpeta, `pwa-${tamano}x${tamano}.png`)
  writeFileSync(ruta, crearPng(tamano))
  console.log(`icono listo: ${ruta}`)
}
