import type from './util/type'
import getRequirements from './util/getRequirements'

function onCountrySelect (country = {}) {
  const { code, name, colors } = country
  const color = colors ? colors[0] : ''

  if (!this.state.passportSelected) {
    this.refs.passportColor.style.background = color

    this.setState({ 
      passportSelected: true
    })

    type(name, this.refs.passport)
    .then(() => {
      this.setState({ 
        passport: code,
        destinationFocused: true
      })
    })

    getRequirements(country)
    .then(requirements => {
      this.REQUIREMENTS_CACHE[code] = requirements
    })
  }
  
  else if (!this.state.destinationSelected) {
    this.refs.destinationColor.style.background = color
    this.setState({ 
      destinationSelected: true
    })

    type(name, this.refs.destination)
    .then(() => {
      this.setState({ 
        destination: code,
      })

      this.checkRequirements()
    })
  }

  this.setState({ 
    typeaheadValue: '' 
  })
}

export default onCountrySelect