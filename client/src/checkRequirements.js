function checkRequirements () {
  if (!this.state.passport || !this.state.destination) return

  const requirements = this.REQUIREMENTS_CACHE[this.state.passport]
  const data = requirements[this.state.destination]

  const clean = data.visa_requirement.toLowerCase()
  let color = ''

  // if (clean.indexOf('visa not required') > -1) {
  //   color = '#aee026'
  // } else if (clean.indexOf('visa required') > -1) {
  //   color = 'orange'
  // } else if (clean.indexOf('travel banned') > -1) {
  //   color = '#ff7d7d'
  // } else if (clean) {
  //   color = '#eee'
  // }

  this.refs.requirement.textContent = data.visa_requirement
  this.refs.requirement.style.background = color
  this.refs.notes.textContent = data.notes

  if (data.allowed_stay) {
    this.refs.allowedStay.textContent = `Allowed Stay: ${data.allowed_stay}`
  } else {
    this.refs.allowedStay.textContent = ''
  }
}

export default checkRequirements