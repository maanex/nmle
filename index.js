const parse = require('@maanex/parse-args')
const fs = require('fs')
const exporter = require('./exporter')
const LOG_ALL = true

function readFolder(path) {
  const files = fs.readdirSync(path)
  const out = []
  for (const folder of files) {
    const fullPath = path + folder + '/'
    if (folder.startsWith('@')) {
      const data = readFolder(fullPath)
      if (data) out.push(...data)
    } else {
      const data = readModule(fullPath)
      if (data) out.push(data)
    }
  }
  return out
}

function readModule(path) {
  let packagejson, license

  if (!fs.existsSync(path + 'package.json')) {
    if (LOG_ALL) console.info(`Skipped module ${path} - no package.json found`)
    return undefined
  } else {
    packagejson = JSON.parse(fs.readFileSync(path + 'package.json'))
  }
  
  if (!fs.existsSync(path + 'LICENSE')) {
    if (!fs.existsSync(path + 'LICENSE.md')) {
      if (LOG_ALL) console.info(`Skipped module ${path} - no license found`)
      return undefined
    } else {
      license = fs.readFileSync(path + 'LICENSE.md')
    }
  } else {
    license = fs.readFileSync(path + 'LICENSE')
  }

  return exporter(packagejson, license)
}

async function main() {
  const args = parse(process.argv)
  if (!args.path) throw 'Missing --path <path to project root>'
  
  const path = args.path + '/node_modules/'
  const out = readFolder(path).join('\n')

  if (args.out) fs.writeFileSync(args.out, out)
  else console.log(out)
}
main()
