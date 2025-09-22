// Servicio para almacenamiento local de imágenes de novelas
export class NovelImageStorageService {
  private static instance: NovelImageStorageService;
  private readonly STORAGE_KEY = 'novel_images_storage';
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB máximo

  static getInstance(): NovelImageStorageService {
    if (!NovelImageStorageService.instance) {
      NovelImageStorageService.instance = new NovelImageStorageService();
    }
    return NovelImageStorageService.instance;
  }

  // Convertir archivo a base64 y almacenar localmente
  async storeNovelImage(novelId: number, file: File): Promise<string> {
    try {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Validar tamaño (máximo 5MB por imagen)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen no puede superar los 5MB');
      }

      // Convertir a base64
      const base64 = await this.fileToBase64(file);
      
      // Obtener almacenamiento actual
      const storage = this.getImageStorage();
      
      // Verificar espacio disponible
      const currentSize = this.calculateStorageSize(storage);
      const newImageSize = base64.length;
      
      if (currentSize + newImageSize > this.MAX_STORAGE_SIZE) {
        throw new Error('No hay suficiente espacio de almacenamiento. Elimina algunas imágenes primero.');
      }

      // Almacenar imagen
      const imageKey = `novel_${novelId}`;
      storage[imageKey] = {
        data: base64,
        filename: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));

      // Retornar URL de datos para uso inmediato
      return base64;
    } catch (error) {
      console.error('Error storing novel image:', error);
      throw error;
    }
  }

  // Obtener imagen de novela
  getNovelImage(novelId: number): string | null {
    try {
      const storage = this.getImageStorage();
      const imageKey = `novel_${novelId}`;
      const imageData = storage[imageKey];
      
      return imageData ? imageData.data : null;
    } catch (error) {
      console.error('Error getting novel image:', error);
      return null;
    }
  }

  // Eliminar imagen de novela
  deleteNovelImage(novelId: number): boolean {
    try {
      const storage = this.getImageStorage();
      const imageKey = `novel_${novelId}`;
      
      if (storage[imageKey]) {
        delete storage[imageKey];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting novel image:', error);
      return false;
    }
  }

  // Obtener todas las imágenes almacenadas
  getAllStoredImages(): { [key: string]: any } {
    return this.getImageStorage();
  }

  // Obtener estadísticas de almacenamiento
  getStorageStats(): { 
    totalImages: number; 
    totalSize: number; 
    availableSpace: number;
    images: Array<{ novelId: number; filename: string; size: number; uploadDate: string }>;
  } {
    const storage = this.getImageStorage();
    const totalSize = this.calculateStorageSize(storage);
    const images = Object.entries(storage).map(([key, data]) => ({
      novelId: parseInt(key.replace('novel_', '')),
      filename: data.filename,
      size: data.size,
      uploadDate: data.uploadDate
    }));

    return {
      totalImages: Object.keys(storage).length,
      totalSize,
      availableSpace: this.MAX_STORAGE_SIZE - totalSize,
      images
    };
  }

  // Limpiar almacenamiento
  clearAllImages(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Métodos privados
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private getImageStorage(): { [key: string]: any } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error parsing image storage:', error);
      return {};
    }
  }

  private calculateStorageSize(storage: { [key: string]: any }): number {
    return Object.values(storage).reduce((total, imageData) => {
      return total + (imageData.data?.length || 0);
    }, 0);
  }
}

export const novelImageStorage = NovelImageStorageService.getInstance();