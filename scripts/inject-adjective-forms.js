const path = require('path')
const jsonfile = require('jsonfile')
const countriesJSON = require('../shared/countries.json')

const COUNTRIES_FILEPATH = path.resolve(__dirname, '../shared/countries.json')

const countries = countriesJSON.slice()

countriesJSON.forEach((country, i) => {
  if (country.adjectiveForm) {
    return
  }

  if (!country.wikipediaSource) {
    console.log(`No wiki source for ${country.name} [${country.code}].`)
    return
  }

  const match = country.wikipediaSource.match(/for_(\w*)_citizens/)

  if (!match) {
    console.log(`No match for ${country.name} [${country.code}].`)
    return
  }

  const adj = match[1].split('_').join(' ')
  countries[i].adjectiveForm = adj
})

jsonfile.writeFileSync(COUNTRIES_FILEPATH, countries, { spaces: 2 })
