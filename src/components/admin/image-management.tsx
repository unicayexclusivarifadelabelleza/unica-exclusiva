'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Upload, Image as ImageIcon, Trash2, CheckCircle, UploadCloud } from 'lucide-react'

interface ImageFile {
  name: string
  url: string
  type: 'portada' | 'logo' | 'producto' | 'ganador' | 'video'
  size: string
}

export function ImageManagement() {
  const [images, setImages] = useState<ImageFile[]>([
    { name: 'portada_hero.jpeg', url: '/portada_hero.jpeg', type: 'portada', size: '103KB' },
    { name: 'logo_principal.jpeg', url: '/logo_principal.jpeg', type: 'logo', size: '72KB' }
  ])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageType, setImageType] = useState<'portada' | 'logo' | 'producto' | 'ganador' | 'video'>('producto')
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona una imagen o video')
      return
    }

    setUploading(true)
    
    try {
      // Simular subida (en producción esto enviaría al servidor)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Crear URL temporal para preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        const newImage: ImageFile = {
          name: selectedFile.name,
          url: base64,
          type: imageType,
          size: `${(selectedFile.size / 1024).toFixed(0)}KB`
        }
        
        setImages([...images, newImage])
        setUploadSuccess(true)
        setSelectedFile(null)
        
        // Reset success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000)
      }
      reader.readAsDataURL(selectedFile)
    } catch (error) {
      console.error('Error al subir imagen:', error)
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = (index: number) => {
    const imageToDelete = images[index]
    
    // No permitir borrar la portada y el logo principal
    if (imageToDelete.type === 'portada' || imageToDelete.type === 'logo') {
      alert('No puedes eliminar la portada o el logo principal desde aquí. Estos se reemplazan automáticamente al subir una nueva imagen del mismo tipo.')
      return
    }
    
    setImages(images.filter((_, i) => i !== index))
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      portada: 'Portada',
      logo: 'Logo',
      producto: 'Producto',
      ganador: 'Ganador',
      video: 'Video'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      portada: 'bg-purple-500',
      logo: 'bg-yellow-500',
      producto: 'bg-blue-500',
      ganador: 'bg-green-500',
      video: 'bg-pink-500'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Subir Nueva Imagen o Video</CardTitle>
          <CardDescription>
            Sube fotos de productos, ganadores o videos de prueba social
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadSuccess && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">¡Imagen subida exitosamente!</span>
              </div>
            </div>
          )}

          <div>
            <Label>Tipo de Contenido</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {[
                { value: 'portada' as const, label: '🖼️ Portada' },
                { value: 'logo' as const, label: '👑 Logo' },
                { value: 'producto' as const, label: '📦 Producto' },
                { value: 'ganador' as const, label: '🏆 Ganador' },
                { value: 'video' as const, label: '🎥 Video' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setImageType(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    imageType === option.value
                      ? 'border-white bg-white/10 text-white'
                      : 'border-border hover:border-white/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="file-upload">Seleccionar Archivo</Label>
            <div className="mt-2">
              <input
                id="file-upload"
                type="file"
                accept={imageType === 'video' ? 'video/*' : 'image/*'}
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                onClick={() => document.getElementById('file-upload')?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-white/50 transition-colors"
              >
                <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedFile ? selectedFile.name : 'Haz click para seleccionar un archivo'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {imageType === 'video' ? 'Formatos: MP4, MOV, AVI' : 'Formatos: JPG, PNG, WEBP'}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
            size="lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Subiendo...' : 'Subir'}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>💡 <strong>Tip:</strong> Si subes una nueva "Portada" o "Logo", automáticamente reemplazará la actual.</p>
            <p>📦 Puedes usar las imágenes subidas en las rifas que crees.</p>
            <p>🎥 Los videos se usarán para contenido de prueba social.</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Images Gallery */}
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Imágenes y Videos Subidos</CardTitle>
          <CardDescription>
            Gestiona todas las imágenes y videos de tu plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative aspect-video bg-card">
                  {image.type === 'video' ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <UploadCloud className="w-12 h-12 text-white/50" />
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Badge className={`absolute top-2 right-2 ${getTypeBadgeColor(image.type)} text-white text-xs`}>
                    {getTypeLabel(image.type)}
                  </Badge>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate mb-1">{image.name}</p>
                      <p className="text-xs text-muted-foreground">{image.size}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteImage(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {images.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                <p>No hay imágenes subidas aún</p>
                <p className="text-sm">Sube tu primera imagen arriba</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
