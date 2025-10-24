'use client'

import { useState, useRef } from 'react'
import { TemplateWrapper } from '@/components/templates/TemplateWrapper'
import { generatePDF, printMenu, downloadAsImage } from '@/lib/menu-builder/pdfGenerator'
import { useMenuBuilder } from '@/context/MenuBuilderContext'

interface MenuPreviewProps {
  restaurant: any
}

export function MenuPreview({ restaurant }: MenuPreviewProps) {
  const { state } = useMenuBuilder()
  const previewRef = useRef<HTMLDivElement>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isDownloadingImage, setIsDownloadingImage] = useState(false)

  const handlePrint = async () => {
    if (!previewRef.current) return
    
    setIsPrinting(true)
    try {
      await printMenu(previewRef.current)
    } catch (error) {
      console.error('Print error:', error)
    } finally {
      setIsPrinting(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!previewRef.current || !state.currentMenu) return
    
    setIsGeneratingPDF(true)
    try {
      await generatePDF(previewRef.current, {
        paperSize: state.currentMenu.paperSize,
        doubleSided: state.currentMenu.doubleSided,
        quality: 1,
        filename: `${state.currentMenu.title}-menu`
      })
    } catch (error) {
      console.error('PDF generation error:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleDownloadImage = async () => {
    if (!previewRef.current || !state.currentMenu) return
    
    setIsDownloadingImage(true)
    try {
      await downloadAsImage(previewRef.current, `${state.currentMenu.title}-menu`)
    } catch (error) {
      console.error('Image download error:', error)
    } finally {
      setIsDownloadingImage(false)
    }
  }

  if (!state.currentMenu) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No menu selected</p>
          <p className="text-sm text-gray-400">Create a new menu to see the preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold">Menu Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPrinting ? 'Printing...' : 'Print'}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isGeneratingPDF ? 'Generating...' : 'PDF'}
          </button>
          <button
            onClick={handleDownloadImage}
            disabled={isDownloadingImage}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isDownloadingImage ? 'Downloading...' : 'Image'}
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div 
          ref={previewRef}
          className="p-8 bg-white"
          style={{
            transform: 'scale(0.7)',
            transformOrigin: 'top left',
            width: '142.86%', // Compensate for scale
            height: '142.86%'
          }}
        >
          <TemplateWrapper
            template={state.currentMenu.template}
            restaurant={restaurant}
            sections={state.currentMenu.sections}
            pageCount={state.currentMenu.pageCount}
            doubleSided={state.currentMenu.doubleSided}
            paperSize={state.currentMenu.paperSize}
          />
        </div>
      </div>

      {/* Preview Info */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <p><strong>Template:</strong> {state.currentMenu.template}</p>
        <p><strong>Pages:</strong> {state.currentMenu.pageCount}</p>
        <p><strong>Paper Size:</strong> {state.currentMenu.paperSize}</p>
        <p><strong>Double-sided:</strong> {state.currentMenu.doubleSided ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}
