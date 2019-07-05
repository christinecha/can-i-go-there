const fs = require('fs-extra')
const path = require('path')
const pages = require('../pages-config')

const SITEMAP_FILEPATH = path.resolve(__dirname, '../public/sitemap.txt')

const URLS = [
  'https://can-i-go-there.com',
]

pages.forEach((page) => {
  const slug = page.filename.split('.html')[0]
  if (slug === 'index') return
  URLS.push(`https://can-i-go-there.com/${slug}`)
})

fs.writeFileSync(SITEMAP_FILEPATH, URLS.join('\n'))
