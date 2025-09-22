// Servicio para gestionar novelas en tendencias
import type { Novel } from '../context/AdminContext';

export interface NovelTrendingItem {
  id: number;
  title: string;
  genre: string;
  chapters: number;
  year: number;
  country: string;
  status: 'transmision' | 'finalizada';
  imageUrl?: string;
  description?: string;
  trendingType: 'day' | 'week';
  addedToTrending: string;
}

export class NovelTrendingService {
  private static instance: NovelTrendingService;
  private readonly TRENDING_KEY = 'novels_trending';

  static getInstance(): NovelTrendingService {
    if (!NovelTrendingService.instance) {
      NovelTrendingService.instance = new NovelTrendingService();
    }
    return NovelTrendingService.instance;
  }

  // Obtener novelas en tendencias
  getTrendingNovels(type: 'day' | 'week'): NovelTrendingItem[] {
    try {
      const stored = localStorage.getItem(this.TRENDING_KEY);
      if (stored) {
        const trending = JSON.parse(stored);
        return trending[type] || [];
      }
    } catch (error) {
      console.error('Error getting trending novels:', error);
    }
    return [];
  }

  // Agregar novela a tendencias
  addToTrending(novel: Novel, type: 'day' | 'week'): void {
    try {
      const trending = this.getAllTrending();
      
      const trendingItem: NovelTrendingItem = {
        id: novel.id,
        title: novel.titulo,
        genre: novel.genero,
        chapters: novel.capitulos,
        year: novel.año,
        country: novel.pais,
        status: novel.estado,
        imageUrl: novel.imagenUrl,
        description: novel.descripcion,
        trendingType: type,
        addedToTrending: new Date().toISOString()
      };

      // Evitar duplicados
      trending[type] = trending[type].filter(item => item.id !== novel.id);
      trending[type].unshift(trendingItem);

      // Mantener solo las últimas 10 novelas por tipo
      trending[type] = trending[type].slice(0, 10);

      localStorage.setItem(this.TRENDING_KEY, JSON.stringify(trending));
      
      // Notificar cambio
      window.dispatchEvent(new CustomEvent('novels_trending_update', {
        detail: { type, novels: trending[type] }
      }));
    } catch (error) {
      console.error('Error adding novel to trending:', error);
    }
  }

  // Remover novela de tendencias
  removeFromTrending(novelId: number, type?: 'day' | 'week'): void {
    try {
      const trending = this.getAllTrending();
      
      if (type) {
        trending[type] = trending[type].filter(item => item.id !== novelId);
      } else {
        // Remover de ambos tipos
        trending.day = trending.day.filter(item => item.id !== novelId);
        trending.week = trending.week.filter(item => item.id !== novelId);
      }

      localStorage.setItem(this.TRENDING_KEY, JSON.stringify(trending));
      
      // Notificar cambio
      window.dispatchEvent(new CustomEvent('novels_trending_update', {
        detail: { type: type || 'all', novels: type ? trending[type] : trending }
      }));
    } catch (error) {
      console.error('Error removing novel from trending:', error);
    }
  }

  // Sincronizar novelas del catálogo con tendencias
  syncWithCatalog(novels: Novel[]): void {
    try {
      const trending = this.getAllTrending();
      
      // Actualizar novelas existentes en tendencias
      ['day', 'week'].forEach(type => {
        trending[type] = trending[type].map(trendingNovel => {
          const catalogNovel = novels.find(n => n.id === trendingNovel.id);
          if (catalogNovel) {
            return {
              ...trendingNovel,
              title: catalogNovel.titulo,
              genre: catalogNovel.genero,
              chapters: catalogNovel.capitulos,
              year: catalogNovel.año,
              country: catalogNovel.pais,
              status: catalogNovel.estado,
              imageUrl: catalogNovel.imagenUrl,
              description: catalogNovel.descripcion
            };
          }
          return trendingNovel;
        }).filter(trendingNovel => 
          // Remover novelas que ya no existen en el catálogo
          novels.some(n => n.id === trendingNovel.id)
        );
      });

      localStorage.setItem(this.TRENDING_KEY, JSON.stringify(trending));
    } catch (error) {
      console.error('Error syncing with catalog:', error);
    }
  }

  // Obtener todas las tendencias
  private getAllTrending(): { day: NovelTrendingItem[]; week: NovelTrendingItem[] } {
    try {
      const stored = localStorage.getItem(this.TRENDING_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error getting all trending:', error);
    }
    return { day: [], week: [] };
  }

  // Limpiar tendencias
  clearTrending(type?: 'day' | 'week'): void {
    try {
      if (type) {
        const trending = this.getAllTrending();
        trending[type] = [];
        localStorage.setItem(this.TRENDING_KEY, JSON.stringify(trending));
      } else {
        localStorage.removeItem(this.TRENDING_KEY);
      }
      
      window.dispatchEvent(new CustomEvent('novels_trending_update', {
        detail: { type: type || 'all', novels: [] }
      }));
    } catch (error) {
      console.error('Error clearing trending:', error);
    }
  }
}

export const novelTrendingService = NovelTrendingService.getInstance();