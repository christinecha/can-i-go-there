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

  const passport = this.COUNTRIES_BY_CODE[this.state.passport]
  const destination = this.COUNTRIES_BY_CODE[this.state.destination]

  if (this.state.passport) {
    this.refs.passport.textContent = passport.code
    this.refs.passportName.textContent = passport.code
    this.refs.passportColor.style.background = this.state.passportColors[0]
    this.refs.passportName.style.color = this.state.passportColors[1]
  } else {
    this.refs.header.textContent = ``
    this.refs.prompt.textContent = "If my passport is from"
    this.refs.options.forEach(($option) => {
      const isActive = isAvailablePassport($option) && isTypeaheadMatch($option)
      $option.dataset.isActive = isActive
      $option.dataset.isPreselected = false
    })
  }

  if (this.state.passport && !this.state.destination) {
    this.refs.header.textContent = `${passport.name} → `
    this.refs.prompt.textContent = "Can I go to"
    this.refs.options.forEach(($option) => {
      const isActive = isAvailableDestination($option) && isTypeaheadMatch($option)
      $option.dataset.isActive = isActive
      $option.dataset.isPreselected = false
    })
  }

  if (!this.state.destination) {
    this.refs.requirement.parentNode.dataset.isActive = false
    this.refs.allowedStay.parentNode.dataset.isActive = false
    this.refs.notes.parentNode.dataset.isActive = false
    this.refs.sources.parentNode.dataset.isActive = false
  } else {
    this.refs.header.textContent = `${passport.name} → ${destination.name}`
    this.refs.destination.textContent = destination.code
    this.refs.destinationName.textContent = destination.code
    this.refs.destinationColor.style.background = this.state.destinationColors[0]
    this.refs.destinationName.style.color = this.state.destinationColors[1]
  } 

  const { preselect } = this.state
  const activeOptions = this.refs.options.filter(o => o.dataset.isActive === "true")
  if (activeOptions[preselect]) {
    activeOptions[preselect].dataset.isPreselected = true
  }

  this.refs.main.dataset.passportSelected = !!this.state.passport
  this.refs.main.dataset.destinationSelected = !!this.state.destination
}

export default render