// pre-process json file to extraction needs
export const prepareData = data => data.formImage.Pages.map((p, index) => ({
  page: (index + 1),
  fills: reduceFills(p),
  content: p.Texts.map(
    ({ x, y, w, R: [ { T } ] }) => ({ x, y, t: decodeURIComponent(T) })
  )
}))

const reduceFills = p => {
  const fillGroups = []
  let currentFillGroup = []
  let lastColor = null

  p.Fills.forEach(f => {
    const lastGroupColor = (currentFillGroup.slice().pop() || {}).oc
    if (f.oc && (!lastGroupColor || f.oc === lastGroupColor)) currentFillGroup.push(f)
    else if (!f.oc && lastGroupColor) {
      fillGroups.push(currentFillGroup)
      currentFillGroup = []
    }
  })

  return fillGroups.reduce((arr, fg = []) => arr.concat(
    fg.reduce((obj, f) => ({
      ...obj,
      x: !obj.x || f.x < obj.x ? f.x : obj.x,
      y: !obj.y || f.y < obj.y ? f.y : obj.y,
      w: !obj.w || (f.x + f.w) > obj.w ? (f.x + f.w) : obj.w,
      h: !obj.h || (f.y + f.h) > obj.h ? (f.y + f.h) : obj.h,
    }), {})
  ), [])
}
