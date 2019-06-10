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
    const { countryCode } = $option.dataset
    const country = this.COUNTRIES_BY_CODE[countryCode]
    const aliases = country.aliases || []
    const names = [ country.name, countryCode, ...aliases ]

    const match = names
      .map(n => n.toLowerCase())
      .find(n => n.indexOf(this.state.typeaheadValue) === 0)
    return !!match
  }

  if (!this.state.passport) {
    this.refs.prompt.textContent = "If my passport is from"
    this.refs.options.forEach(($option) => {
      const isActive = isAvailablePassport($option) && isTypeaheadMatch($option)
      $option.dataset.isActive = isActive
      $option.dataset.isPreselected = false
    })
  } else if (!this.state.destination) {
    this.refs.prompt.textContent = "Can I go to"
    this.refs.options.forEach(($option) => {
      const isActive = isAvailableDestination($option) && isTypeaheadMatch($option)
      $option.dataset.isActive = isActive
      $option.dataset.isPreselected = false
    })
  }

  const { preselect } = this.state
  const activeOptions = this.refs.options.filter(o => o.dataset.isActive === "true")
  activeOptions[preselect].dataset.isPreselected = true

  this.refs.main.dataset.passportSelected = !!this.state.passport
  this.refs.main.dataset.destinationSelected = !!this.state.destination
}

export default render