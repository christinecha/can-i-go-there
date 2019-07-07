import type from './util/type'
import getRequirements from './util/getRequirements'

const getRand = arr => (
  Math.floor(Math.random() * arr.length)
)

function onCountrySelect (country = {}) {
  const { code, name } = country
  const colors = country.colors || []
  const colorsLeft = colors.slice()

  const rand1 = getRand(colorsLeft)
  const color1 = colorsLeft[rand1] || ''
  colorsLeft.splice(rand1, 1)
  const rand2 = getRand(colorsLeft)
  const color2 = colorsLeft[rand2] || ''
  
  if (!this.state.passport) {
    this.refs.passportColor.style.background = color1
    this.refs.passportName.style.color = color2

    getRequirements(country)
    .then(requirements => {
      this.REQUIREMENTS_CACHE[code] = requirements

      this.setState({ 
        passport: code,
      })
  
      this.refs.passport.textContent = code
      this.refs.passportName.textContent = code
    })
  }
  
  else if (!this.state.destination) {
    const passport = this.COUNTRIES_BY_CODE[this.state.passport]
    this.refs.destinationColor.style.background = color1
    this.refs.destinationName.style.color = color2

    this.refs.destination.textContent = code
    this.refs.destinationName.textContent = code

    this.setState({ 
      destination: code,
    })

    this.checkRequirements()
  }

  this.refs.typeahead.value = ''
  this.setState({ typeaheadValue: '', preselect: 0 })
}

export default onCountrySelect