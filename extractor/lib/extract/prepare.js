// pre-process json file to extraction needs
export const prepareData = data => data.formImage.Pages.map((p, index) => ({
  page: (index + 1),
  lines: p.HLines,
  content: p.Texts.map(
    ({ x, y, w, A, R: [{ T, TS }] }) => ({
      x,
      y,
      a: A,
      t: decodeURIComponent(T),
      s: TS[1],
      b: Boolean(TS[2]),
      i: Boolean(TS[3])
    })
  )
}))
