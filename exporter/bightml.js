exports.module = (packagejson, license) => {
  return [
    '',
    '<details>',
    `<summary><span style="display: inline">${packagejson.name.toUpperCase()}</span></summary>`,
    '',
    license
      .split('#### ').join('##### ')
      .split('### ').join('##### ')
      .split('## ').join('### ')
      .split('# ').join('## '),
    '---',
    '</details>',
    ''
  ].join('\n')
}
