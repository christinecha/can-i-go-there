// Based off of: https://github.com/scottcorgan/hex-to-rgb/blob/master/index.js

const removeHash = hex => {
  const arr = hex.split('')
  arr.shift()
  return arr.join('')
}

const expand = hex => {
  return hex
    .split('')
    .reduce((accum, value) => {
      return accum.concat([value, value])
    }, [])
    .join('')
}

export const hexToRgb = (hex) => {
  if (hex.charAt && hex.charAt(0) === '#') {
    hex = removeHash(hex)
  }

  if (hex.length === 3) {
    hex = expand(hex)
  }

  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return {r, g, b}
}

export const rgbToHex = ({r,g,b}) => {
  const parse = n => `0${parseInt(n,10).toString(16)}`.slice(-2)
  return `#${parse(r)}${parse(g)}${parse(b)}`
}