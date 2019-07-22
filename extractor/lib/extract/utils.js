export const textFixings = text => {
  let t = text.replace(/–/g, '-')
  t = fixSeparatorChar(t, '/')
  t = fixSeparatorChar(t, '-')
  return t.replace(/ +/g, ' ')
    .replace(/^( )?\-( )?/, '')
    .replace(/( )?\-( )?$/, '')
    .trim()
}

const fixSeparatorChar = (text, char) =>
  text.includes(`${char}`) && !text.includes(` ${char} `)
    ? text.replace(new RegExp(` ${char}`, 'g'), `${char}`)
        .replace(new RegExp(`${char} `, 'g'), `${char}`)
        .replace(new RegExp(`${char}`, 'g'), ` ${char} `)
    : text
