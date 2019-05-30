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
    
    initDOM, 
    render
  }
}

const app = App()

app.initDOM()
app.render()

const checkRequirements = () => {
  if (!app.state.passport || !app.state.destination) return

  const requirements = app.REQUIREMENTS_CACHE[app.state.passport]
  const data = requirements[app.state.destination]

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

  app.refs.requirement.textContent = data.visa_requirement
  app.refs.requirement.style.background = color
  app.refs.notes.textContent = data.notes

  if (data.allowed_stay) {
    app.refs.allowedStay.textContent = `Allowed Stay: ${data.allowed_stay}`
  } else {
    app.refs.allowedStay.textContent = ''
  }
}

app.refs.destinationTypeahead.addEventListener('focus', app.onDestinationInput.bind(app))
app.refs.passportTypeahead.addEventListener('focus', app.onPassportInput.bind(app))

app.refs.passportTypeahead.addEventListener('keyup', app.onPassportInput.bind(app))
app.refs.destinationTypeahead.addEventListener('keyup', app.onDestinationInput.bind(app))

const type = (str = '', el) => {
  return new Promise(resolve => {
    var left = str
  
    const interval = setInterval(() => {
      if (left.length === 0) {
        clearInterval(interval)
        resolve()
        return
      }
  
      el.value += left[0] 
      left = left.substr(1)
    }, 80)
  })
}

app.refs.options.forEach($option => {
  $option.addEventListener('click', () => {
    if (app.state.view === 'DESTINATION') {
      const countryCode = $option.dataset.countryCode
      const destinationCountry = app.COUNTRIES_BY_CODE[countryCode] || {}
      
      if (destinationCountry.colors) {
        const color = destinationCountry.colors[0]
        app.refs.destinationColor.style.background = color
      }

      type($option.dataset.country, app.refs.destination)
      .then(() => {
        app.setState({ 
          destination: $option.dataset.countryCode,
        })

        checkRequirements()
      })

      app.setState({ 
        view: 'REQUIREMENTS',
        typeaheadValue: '' 
      })
    }

    if (app.state.view === 'PASSPORT') {
      const countryCode = $option.dataset.countryCode
      const passportCountry = app.COUNTRIES_BY_CODE[countryCode] || {}

      if (passportCountry.colors) {
        const color = passportCountry.colors[0]
        app.refs.passportColor.style.background = color
      }

      type($option.dataset.country, app.refs.passport)
      .then(() => {
        app.setState({ 
          passport: countryCode,
        })
      })

      import(
        /* webpackChunkName: "[request]" */ 
        `../../data/visa-requirements/${countryCode}.json`
      ).then(({ default: requirements }) => {
        app.REQUIREMENTS_CACHE[countryCode] = requirements
        app.setState({ 
          view: 'DESTINATION',
          typeaheadValue: '' 
        })
      })
    }
  })
})