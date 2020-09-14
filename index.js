const parse = require('@maanex/parse-args')
const fs = require('fs')
const LOG_ALL = false

let exporter
const tracked = []

function readFolder(path, filelist, noDuplicates, exclude) {
  const files = filelist || fs.readdirSync(path)
  const out = []
  files: for (const folder of files) {
    if (exclude) {
      for (const prefix of exclude)
        if (folder.startsWith(prefix)) continue files
    }
    const fullPath = path + folder + '/'
    if (!filelist && folder.startsWith('@')) {
      const data = readFolder(fullPath)
      if (data) out.push(...data)
    } else {
      const data = readModule(fullPath, noDuplicates)
      if (data) out.push(data)
    }
  }
  return out
}

function readModule(path, noDuplicates) {
  let packagejson, license

  if (noDuplicates) {
    const id = path.split('node_modules')[1]
    if (tracked.includes(id)) return undefined
    tracked.push(id)
  }

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

  return exporter.module(packagejson, license.toString())
}

function read(path, noDependencies, noDuplicates, exclude) {
  let filelist
  
  if (noDependencies) {
    const packagejson = JSON.parse(fs.readFileSync(path + '/package.json'))
    filelist = Object.keys(packagejson.dependencies)
  }
  
  return readFolder(path + '/node_modules/', filelist, noDuplicates, exclude)
}

async function main() {
  const args = parse(process.argv)
  if (!args.path) throw 'Missing --path <path to project root>'
  const noDependencies = !!args.noDependencies || !!args.d
  const noDuplicates = !!args.noDuplicates || !!args.u
  const exclude = args.exclude

  exporter = require(`./exporter/${args.exporter || 'markdown'}`)

  const out = []
  for (const path of args.path.split(';')) {
    data = read(path, noDependencies, noDuplicates, exclude)
    if (data) out.push(...data)
  }

  const finished = (exporter.prefix ?? '') + out.join(exporter.divider ?? '\n') + (exporter.suffix ?? '')

  if (args.out) fs.writeFileSync(args.out, finished)
  else console.log(finished)
}
main()
