import type from './util/type'
import getRequirements from './util/getRequirements'

function onCountrySelect (country = {}) {
  const { code, colors } = country
  const color = colors ? colors[0] : ''

  if (!this.state.passport) {
    this.refs.passportColor.style.background = color

    getRequirements(country)
    .then(requirements => {
      this.REQUIREMENTS_CACHE[code] = requirements

      this.setState({ 
        passport: code,
      })
  
      this.refs.passport.textContent = code
    })
  }
  
  else if (!this.state.destination) {
    this.refs.destinationColor.style.background = color

    this.refs.destination.textContent = code
    this.setState({ 
      destination: code,
    })

    this.checkRequirements()
  }

  this.refs.typeahead.value = ''
  this.setState({ typeaheadValue: '' })
}

export default onCountrySelect