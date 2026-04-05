import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 })
    }

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    return NextResponse.json({
      success: true,
      url: url,
      html: html,
      status: response.status
    })
  } catch (error: any) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al obtener el inventario'
    }, { status: 500 })
  }
}
