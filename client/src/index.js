import axios from 'axios'
import countriesJSON from '../../shared/countries.json'

const $destination = document.getElementById('destination')
const $passport = document.getElementById('passport')
const $check = document.getElementById('check')
const $requirement = document.getElementById('requirement')
const $allowedStay = document.getElementById('allowed-stay')
const $notes = document.getElementById('notes')

const createOption = ({ name = '', value = '' }) => {
  const opt = document.createElement('OPTION')
  opt.innerHTML = name
  opt.value = value
  return opt
}

$destination.appendChild(createOption({}))
$passport.appendChild(createOption({}))

countriesJSON.forEach(country => {
  const option = { name: country.name, value: country.code }
  const destinationOption = createOption(option)
  const passportOption = createOption(option)

  $destination.appendChild(destinationOption)

  if (country.wikipediaSource) {
    $passport.appendChild(passportOption)
  }
})

$check.addEventListener('click', () => {
  axios.get('/.netlify/functions/visa-requirements', {
    params: {
      destination_country: $destination.value,
      passport_country: $passport.value,
    }
  })
  .then(response => {
    const { data } = response

    const clean = data.visa_requirement.toLowerCase()
    let color = ''

    if (clean.indexOf('visa not required') > -1) {
      color = '#aee026'
    } else if (clean.indexOf('visa required') > -1) {
      color = 'orange'
    }

    console.log(data)
    $requirement.textContent = data.visa_requirement
    $requirement.style.background = color
    $notes.textContent = data.notes

    if (data.allowed_stay) {
      $allowedStay.textContent = `Allowed Stay: ${data.allowed_stay}`
    }
  })
  .catch(err => {
    console.warn(err)
    $requirement.textContent = 'Not found.'
    $requirement.style.background = '#eee'
    $allowedStay.textContent = ''
    $notes.textContent = ''
    return 
  })
})