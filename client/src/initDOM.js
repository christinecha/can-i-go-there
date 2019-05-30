import countriesJSON from '../../shared/countries.json'

function initDOM () {
  this.refs = {
    main: document.getElementsByTagName('MAIN')[0],
    destinationColor: document.getElementById('destination-color'),
    passportColor: document.getElementById('passport-color'),
    destinationTypeahead: document.getElementById('destination-typeahead'),
    passportTypeahead: document.getElementById('passport-typeahead'),
    destination: document.getElementById('destination'),
    passport: document.getElementById('passport'),
    requirement: document.getElementById('requirement'),
    allowedStay: document.getElementById('allowed-stay'),
    notes: document.getElementById('notes'),
    optionsWrapper: document.getElementById('options'),
    options: []
  }

  const createOption = (country = {}) => {
    const opt = document.createElement('DIV')
    opt.classList.add('option')
    opt.innerHTML = country.name
    opt.dataset.country = country.name.toLowerCase()
    opt.dataset.countryCode = country.code
    return opt
  }

  countriesJSON.forEach(country => {
    const $option = createOption(country)
    this.refs.options.push($option)
    this.refs.optionsWrapper.appendChild($option)
  })

  this.refs.passport.value = ''
  this.refs.destination.value = ''
}

export default initDOM

