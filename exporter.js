module.exports = (packagejson, license) => {
  return [
    '---',
    '',
    `### ${packagejson.name.toUpperCase()}`,
    '',
    license,
    ''
  ].join('\n')
}
