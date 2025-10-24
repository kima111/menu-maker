// Paper size configurations for different formats
export const PAPER_SIZES = {
  letter: {
    width: 8.5,
    height: 11,
    unit: 'in',
    margin: 0.5,
    name: 'Letter (8.5" × 11")'
  },
  a4: {
    width: 210,
    height: 297,
    unit: 'mm',
    margin: 12,
    name: 'A4 (210mm × 297mm)'
  },
  legal: {
    width: 8.5,
    height: 14,
    unit: 'in',
    margin: 0.5,
    name: 'Legal (8.5" × 14")'
  }
} as const

export type PaperSize = keyof typeof PAPER_SIZES

// Calculate content area based on paper size and margins
export function getContentDimensions(paperSize: PaperSize) {
  const config = PAPER_SIZES[paperSize]
  const margin = config.margin
  
  return {
    width: config.width - (margin * 2),
    height: config.height - (margin * 2),
    unit: config.unit,
    margin
  }
}

// Calculate how many dishes can fit per page based on template and paper size
export function calculateDishesPerPage(
  template: 'sushi' | 'fancy',
  paperSize: PaperSize,
  doubleSided: boolean
) {
  const content = getContentDimensions(paperSize)
  
  if (template === 'sushi') {
    // Sushi template uses a 2-column grid with image slots
    const dishesPerRow = 2
    const rowsPerPage = Math.floor(content.height / 3) // Approximate row height
    return dishesPerRow * rowsPerPage * (doubleSided ? 2 : 1)
  } else {
    // Fancy template uses single column with more spacing
    const dishesPerPage = Math.floor(content.height / 2.5) // Approximate dish height
    return dishesPerPage * (doubleSided ? 2 : 1)
  }
}

// Distribute dishes across pages
export function distributeDishesAcrossPages(
  sections: any[],
  pageCount: number,
  template: 'sushi' | 'fancy',
  paperSize: PaperSize,
  doubleSided: boolean
) {
  const dishesPerPage = calculateDishesPerPage(template, paperSize, doubleSided)
  const totalPages = pageCount * (doubleSided ? 2 : 1)
  const totalCapacity = dishesPerPage * totalPages
  
  // Flatten all dishes from sections
  const allDishes = sections.flatMap(section => 
    section.dishes.filter((dish: any) => dish.isAvailable)
  )
  
  // Calculate if we need to adjust page count
  const requiredPages = Math.ceil(allDishes.length / dishesPerPage)
  const adjustedPageCount = Math.max(pageCount, requiredPages)
  
  // Distribute dishes across pages
  const pages: any[] = []
  let dishIndex = 0
  
  for (let page = 0; page < adjustedPageCount; page++) {
    const pageDishes = allDishes.slice(dishIndex, dishIndex + dishesPerPage)
    pages.push({
      pageNumber: page + 1,
      dishes: pageDishes,
      isFull: pageDishes.length === dishesPerPage
    })
    dishIndex += dishesPerPage
  }
  
  return {
    pages,
    adjustedPageCount,
    totalDishes: allDishes.length,
    dishesPerPage
  }
}

// Generate print-friendly CSS classes
export function getPrintClasses(paperSize: PaperSize, doubleSided: boolean) {
  return [
    `paper-${paperSize}`,
    doubleSided ? 'double-sided' : '',
    'print-container'
  ].filter(Boolean).join(' ')
}
