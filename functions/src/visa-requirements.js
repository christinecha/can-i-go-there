const getVisaRequirements = require('../visa-requirements')
const countriesJSON = require('../../shared/countries.json')

exports.handler = (event, context, callback) => {
  const { destination_country, passport_country } = event.queryStringParameters
  const country = countriesJSON.find(c => c.code === passport_country)

  if (!country) {
    callback(null, {
      statusCode: 500,
      error: 'Could not fetch visa requirements.'
    })
    return
  }

  getVisaRequirements(country)
  .then((requirements = []) => {
    const requirement = requirements.find(r => {
      return r.destination_country === destination_country
    })

    if (!requirement) {
      callback(null, {
        statusCode: 500,
        error: 'Could not fetch visa requirements.'
      })
      return
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(requirement)
    })
  })
}