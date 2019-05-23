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

countriesJSON.forEach(country => {
  if (!country.wikipediaSource) {
    return
  }

  getVisaRequirements(country)
  .then((requirements = []) => {
    const data = {}
    requirements.forEach(r => {
      data[r.destination_country] = r
    })

    const filepath = path.resolve(REQUIREMENTS_FOLDER, `${country.code}.json`)
    
    jsonfile.writeFileSync(filepath, data, { spaces: 2 })
  })
})
