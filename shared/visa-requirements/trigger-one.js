const fs = require('fs-extra')
const path = require('path')
const jsonfile = require('jsonfile')

const countriesJSON = require('../countries.json')
const getVisaRequirements = require('./index')

const DATA_FOLDER = path.resolve(__dirname, `../../data`)
const REQUIREMENTS_FOLDER = path.resolve(DATA_FOLDER, `visa-requirements`)


if (!fs.existsSync(REQUIREMENTS_FOLDER)) {
  fs.mkdirSync(REQUIREMENTS_FOLDER)
}

const firstCountry = countriesJSON.find(country => {
  return !!country.wikipediaSource
})

getVisaRequirements(firstCountry)
.then((requirements = []) => {
  const data = {}
  requirements.forEach(r => {
    data[r.destination_country] = r
  })

  const filepath = path.resolve(REQUIREMENTS_FOLDER, `${firstCountry.code}.json`)
  
  jsonfile.writeFileSync(filepath, data, { spaces: 2 })
})
