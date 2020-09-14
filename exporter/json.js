exports.prefix = '['

exports.module = (packagejson, license) => {
  return JSON.stringify({
    name: packagejson.name,
    license: license.split('"').join('\\"')
  })
}

exports.divider = ','

exports.suffix = ']'
