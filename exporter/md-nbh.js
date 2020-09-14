// Markdown - No Big Header

exports.module = (packagejson, license) => {
  return [
    '---',
    '',
    `### ${packagejson.name.toUpperCase()}`,
    '',
    license
      .split('#### ').join('##### ')
      .split('### ').join('##### ')
      .split('## ').join('### ')
      .split('# ').join('### '),
    ''
  ].join('\n')
}
