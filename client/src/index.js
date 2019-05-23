import countriesJSON from '../../shared/countries.json'

const $destination = document.getElementById('destination')
const $passport = document.getElementById('passport')
const $check = document.getElementById('check')
const $requirement = document.getElementById('requirement')
const $allowedStay = document.getElementById('allowed-stay')
const $notes = document.getElementById('notes')

const REQUIREMENTS_CACHE = {}

const countriesByKey = countriesJSON.reduce((obj, c) => {
  return {
    ...obj,
    [c.code]: c
  }
}, {})

const createOption = (country = {}) => {
  const opt = document.createElement('OPTION')
  opt.innerHTML = country.name || ''
  opt.value = country.code || ''
  return opt
}

$passport.appendChild(createOption())

countriesJSON.forEach(country => {
  const passportOption = createOption(country)

  if (country.wikipediaSource) {
    $passport.appendChild(passportOption)
  }
})

$passport.addEventListener('change', () => {
  const passport_country = $passport.value
  return import(
    /* webpackChunkName: "[request]" */ 
    `../../data/visa-requirements/${passport_country}.json`
  ).then(({ default: requirements }) => {
    REQUIREMENTS_CACHE[passport_country] = requirements

    $destination.innerHTML = ''
    $destination.appendChild(createOption())

    Object.keys(requirements).forEach((destination_country) => {
      const country = countriesByKey[destination_country]
      const destinationOption = createOption(country)
      $destination.appendChild(destinationOption)
    })
  })
})

$check.addEventListener('click', () => {
  const requirements = REQUIREMENTS_CACHE[$passport.value]
  const data = requirements[$destination.value]

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

  $requirement.textContent = data.visa_requirement
  $requirement.style.background = color
  $notes.textContent = data.notes

  if (data.allowed_stay) {
    $allowedStay.textContent = `Allowed Stay: ${data.allowed_stay}`
  } else {
    $allowedStay.textContent = ''
  }
})