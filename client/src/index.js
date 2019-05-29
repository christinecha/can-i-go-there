import countriesJSON from '../../shared/countries.json'
import initDOM from './initDOM'
import render from './render'

const AVAILABLE_PASSPORTS = countriesJSON.filter(n => n.wikipediaSource).map(n => n.code)
const COUNTRIES_BY_CODE = countriesJSON.reduce((obj, c) => ({
  ...obj, 
  [c.code]: c
}), {})

const App = () => {
  return {
    COUNTRIES_BY_CODE, 
    AVAILABLE_PASSPORTS,
    REQUIREMENTS_CACHE: {},

    state: {
      view: 'PASSPORT',
      typeaheadValue: '',
      passport: '',
      destination: ''
    },

    setState(obj) {
      this.state = { ...this.state, ...obj }
      this.render()
    },

    onPassportInput(e) {
      this.setState({ 
        view: 'PASSPORT',
        typeaheadValue: (e.target.value || '').trim().toLowerCase(),
      })
    },

    onDestinationInput(e) {
      this.setState({ 
        view: 'DESTINATION',
        typeaheadValue: (e.target.value || '').trim().toLowerCase(),
      })
    },
  
    render
  }
}

const _ = App()

initDOM(_)
_.render()

const checkRequirements = () => {
  if (!_.state.passport || !_.state.destination) return

  const requirements = _.REQUIREMENTS_CACHE[_.state.passport]
  const data = requirements[_.state.destination]

  const clean = data.visa_requirement.toLowerCase()
  let color = ''

  if (clean.indexOf('visa not required') > -1) {
    color = '#aee026'
  } else if (clean.indexOf('visa required') > -1) {
    color = 'orange'
  } else if (clean.indexOf('travel banned') > -1) {
    color = '#ff7d7d'
  } else if (clean) {
    color = '#eee'
  }

  _.refs.requirement.textContent = data.visa_requirement
  _.refs.requirement.style.background = color
  _.refs.notes.textContent = data.notes

  if (data.allowed_stay) {
    _.refs.allowedStay.textContent = `Allowed Stay: ${data.allowed_stay}`
  } else {
    _.refs.allowedStay.textContent = ''
  }
}

_.refs.destinationTypeahead.addEventListener('focus', _.onDestinationInput.bind(_))
_.refs.passportTypeahead.addEventListener('focus', _.onPassportInput.bind(_))

_.refs.passportTypeahead.addEventListener('keyup', _.onPassportInput.bind(_))
_.refs.destinationTypeahead.addEventListener('keyup', _.onDestinationInput.bind(_))

_.refs.options.forEach($option => {
  $option.addEventListener('click', () => {
    if (_.state.view === 'DESTINATION') {
      _.refs.destination.value = $option.dataset.country
      _.setState({ 
          view: 'REQUIREMENTS',
          destination: $option.dataset.countryCode,
          typeaheadValue: '' 
      })
    }

    if (_.state.view === 'PASSPORT') {
      const countryCode = $option.dataset.countryCode
      _.refs.passport.value = $option.dataset.country
      import(
        /* webpackChunkName: "[request]" */ 
        `../../data/visa-requirements/${countryCode}.json`
      ).then(({ default: requirements }) => {
        _.REQUIREMENTS_CACHE[countryCode] = requirements
        _.setState({ 
          view: 'DESTINATION',
          passport: countryCode,
          typeaheadValue: '' 
        })
      })
    }

    checkRequirements()
  })
})