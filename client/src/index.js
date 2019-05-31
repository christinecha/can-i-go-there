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
      passportFocused: true,
      passportSelected: false,
      destinationFocused: false,
      destinationSelected: false,
      typeaheadValue: '',
      passport: '',
      destination: ''
    },

    setState(obj) {
      this.state = { ...this.state, ...obj }
      this.render()
    },

    init() {
      this.initDOM()
      this.render()
      this.refs.passportTypeahead.focus()

      document.addEventListener('keydown', this.onDocumentKeyDown.bind(this))
      this.refs.passportTypeahead.addEventListener('keyup', this.onInput.bind(this))
      this.refs.destinationTypeahead.addEventListener('keyup', this.onInput.bind(this))


      this.refs.options.forEach($option => {
        $option.addEventListener('click', () => {
          const countryCode = $option.dataset.countryCode
          const country = this.COUNTRIES_BY_CODE[countryCode] || {}

          this.onCountrySelect(country)
        })
      })
    },

    onInput(e) {
      const { passportSelected } = this.state
      const input = passportSelected 
        ? this.refs.destination 
        : this.refs.passport

      const typeaheadValue = (e.target.value || '').toLowerCase()
      input.textContent = typeaheadValue
      this.setState({ 
        typeaheadValue,
      })
    },

    onDocumentKeyDown() {
      if (!this.state.passportSelected) {
        this.refs.passportTypeahead.focus()
      } else {
        this.refs.destinationTypeahead.focus()
      }
    },
    
    onCountrySelect,
    checkRequirements,
    initDOM, 
    render
  }
}

const app = App()
app.init()