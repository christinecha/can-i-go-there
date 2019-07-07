import type from './util/type'
import getRequirements from './util/getRequirements'
import {hexToRgb, rgbToHex} from './util/hexToRgb'

const getRand = arr => (
  Math.floor(Math.random() * arr.length)
)

const tooSimilar = (color1, color2) => {
  return !Object.keys(color1).find(key => {
    return Math.abs(color1[key] - color2[key]) > 10
  })
}

const up = val => Math.max(0, Math.min(255, val + 15))
const dw = val => Math.max(0, Math.min(255, val - 15))

const shiftColor = ({ r, g, b }) => {
  const isLight = (r + g + b) > (255 * 3 / 2)
  if (isLight) {
    return { r: dw(r), g: dw(g), b: dw(b) }
  }

  return { r: up(r), g: up(g), b: up(b) }
}

const makeUnique = (color, base) => {
  if (!color || !base) {
    return color
  }

  const colorRgb = hexToRgb(color)
  const baseRgb = hexToRgb(base)

  if (tooSimilar(colorRgb, baseRgb)) {
    const shifted = rgbToHex(shiftColor(colorRgb))
    return shifted
  }

  return color
}

const getTwoColors = (arr, base = '') => {
  const colorsLeft = arr.slice()
  const rand1 = getRand(colorsLeft)
  const color1 = makeUnique(colorsLeft[rand1], base)

  colorsLeft.splice(rand1, 1)
  const rand2 = getRand(colorsLeft)
  const color2 = colorsLeft[rand2]

  return [ (color1 || ''), (color2 || '') ]
}

function onCountrySelect (country = {}) {
  const { code } = country
  const colors = country.colors || []
  
  if (!this.state.passport) {
    getRequirements(country)
    .then(requirements => {
      this.REQUIREMENTS_CACHE[code] = requirements

      this.setState({ 
        passport: code,
        passportColors: getTwoColors(colors)
      })
    })
  }
  
  else if (!this.state.destination) {
    this.setState({ 
      destination: code,
      destinationColors: getTwoColors(colors, this.state.passportColors[0])
    })

    this.checkRequirements()
  }

  this.refs.typeahead.value = ''
  this.setState({ typeaheadValue: '', preselect: 0 })
}

export default onCountrySelect