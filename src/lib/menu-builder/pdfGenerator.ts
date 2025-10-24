'use client'

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { PAPER_SIZES, getContentDimensions } from './printConfig'

interface PDFExportOptions {
  paperSize: 'letter' | 'a4' | 'legal'
  doubleSided: boolean
  quality: number
  filename: string
}

export async function generatePDF(
  element: HTMLElement,
  options: PDFExportOptions
): Promise<void> {
  const { paperSize, doubleSided, quality = 1, filename } = options
  const config = PAPER_SIZES[paperSize]
  
  try {
    // Configure html2canvas options
    const canvasOptions = {
      scale: quality * 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0
    }

    // Generate canvas from HTML element
    const canvas = await html2canvas(element, canvasOptions)
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: config.height > config.width ? 'portrait' : 'landscape',
      unit: config.unit,
      format: [config.width, config.height]
    })

    // Calculate dimensions
    const content = getContentDimensions(paperSize)
    const imgWidth = content.width
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png', 0.95)
    pdf.addImage(imgData, 'PNG', config.margin, config.margin, imgWidth, imgHeight)

    // Save PDF
    pdf.save(`${filename}.pdf`)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}

export async function printMenu(element: HTMLElement): Promise<void> {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      throw new Error('Unable to open print window')
    }

    // Get the HTML content
    const htmlContent = element.outerHTML
    
    // Add print styles
    const printStyles = `
      <style>
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
            color: black !important;
          }
          .print-container {
            width: 100%;
            height: 100vh;
            margin: 0;
            padding: 0;
            background: white;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    `

    // Write content to print window
    printWindow.document.write(`
      <html>
        <head>
          <title>Menu Print</title>
          ${printStyles}
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `)

    printWindow.document.close()
    
    // Wait for images to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
    
  } catch (error) {
    console.error('Error printing menu:', error)
    throw new Error('Failed to print menu')
  }
}

export function downloadAsImage(element: HTMLElement, filename: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      // Create download link
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL('image/png', 0.95)
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      resolve()
    } catch (error) {
      console.error('Error downloading image:', error)
      reject(new Error('Failed to download image'))
    }
  })
}
