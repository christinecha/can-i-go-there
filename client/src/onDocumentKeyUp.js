function onDocumentKeyUp(e) {
  const activeOptions = this.refs.options.filter(o => o.dataset.isActive === "true")

  // ESC
  if (e.keyCode === 27) {
    this.setState({ 
      passport: '',
      destination: '',
    })
    return
  }

  // ENTER
  if (e.keyCode === 13) {
    const option = activeOptions[this.state.preselect]

    if (option) {
      const country = this.COUNTRIES_BY_CODE[option.dataset.countryCode]
      this.onCountrySelect(country)
    }

    return 
  }

  let requestedPreselect = this.state.preselect

  // DOWN
  if (e.keyCode === 40) {
    requestedPreselect += 1
  }

  // UP
  if (e.keyCode === 38) {
    requestedPreselect -= 1
  }

  const preselect = Math.min(Math.max(0, requestedPreselect), activeOptions.length - 1)
  this.setState({ preselect })
}

export default onDocumentKeyUp