function render () {
  const isAvailablePassport = $option => {
    const { countryCode } = $option.dataset
    return this.AVAILABLE_PASSPORTS.indexOf(countryCode) > -1
  }

  const isAvailableDestination = $option => {
    if (!this.state.passport) return false
    const requirements = this.REQUIREMENTS_CACHE[this.state.passport]
    const { countryCode } = $option.dataset
    return requirements[countryCode]
  }

  const isTypeaheadMatch = $option => {
    const { country } = $option.dataset
    return country.indexOf(this.state.typeaheadValue) === 0
  }

  if (!this.state.passport) {
    this.refs.prompt.textContent = "If my passport is from"
    this.refs.options.forEach(($option) => {
      const isActive = isAvailablePassport($option) && isTypeaheadMatch($option)
      $option.dataset.isActive = isActive
    })
  } else if (!this.state.destination) {
    this.refs.prompt.textContent = "Can I go to"
    this.refs.options.forEach(($option) => {
      const isActive = isAvailableDestination($option) && isTypeaheadMatch($option)
      $option.dataset.isActive = isActive
    })
  }

  this.refs.main.dataset.passportSelected = !!this.state.passport
  this.refs.main.dataset.destinationSelected = !!this.state.destination
}

export default render