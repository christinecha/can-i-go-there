import countriesJSON from '../../shared/countries.json'
import initDOM from './initDOM'
import render from './render'
import onCountrySelect from './onCountrySelect'
import checkRequirements from './checkRequirements'

import '../styles/index.scss'

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
      passportSelected: false,
      destinationSelected: false,
      typeaheadValue: '',
      passport: '',
      destination: ''
    },

    setState(obj) {
      this.state = { ...this.state, ...obj }
      this.render()
    },

    onInput(e) {
      this.setState({ 
        typeaheadValue: (e.target.value || '').trim().toLowerCase(),
      })
    },
    
    onCountrySelect,
    checkRequirements,
    initDOM, 
    render
  }
}

const app = App()

app.initDOM()
app.render()


app.refs.destinationTypeahead.addEventListener('focus', app.onInput.bind(app))
app.refs.passportTypeahead.addEventListener('focus', app.onInput.bind(app))

app.refs.passportTypeahead.addEventListener('keyup', app.onInput.bind(app))
app.refs.destinationTypeahead.addEventListener('keyup', app.onInput.bind(app))

app.refs.options.forEach($option => {
  $option.addEventListener('click', () => {
    const countryCode = $option.dataset.countryCode
    const country = app.COUNTRIES_BY_CODE[countryCode] || {}

    app.onCountrySelect(country)
  })
})