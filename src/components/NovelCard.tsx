import React from 'react';
import { Star, Calendar, MapPin, Play, BookOpen, Tv, CheckCircle } from 'lucide-react';
import { novelImageStorage } from '../services/novelImageStorage';
import type { NovelTrendingItem } from '../services/novelTrendingService';

interface NovelCardProps {
  novel: NovelTrendingItem;
  onClick?: () => void;
}

export function NovelCard({ novel, onClick }: NovelCardProps) {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    // Cargar imagen desde almacenamiento local
    const storedImage = novelImageStorage.getNovelImage(novel.id);
    if (storedImage) {
      setImageUrl(storedImage);
    }
  }, [novel.id]);

  const getStatusIcon = () => {
    return novel.status === 'transmision' ? (
      <div className="flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
        EN VIVO
      </div>
    ) : (
      <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        <CheckCircle className="h-3 w-3 mr-1" />
        COMPLETA
      </div>
    );
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Turquía': '🇹🇷',
      'Brasil': '🇧🇷',
      'Colombia': '🇨🇴',
      'México': '🇲🇽',
      'Argentina': '🇦🇷',
      'España': '🇪🇸',
      'India': '🇮🇳',
      'Corea del Sur': '🇰🇷',
      'Estados Unidos': '🇺🇸',
      'Reino Unido': '🇬🇧'
    };
    return flags[country] || '🌍';
  };

  const defaultImage = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=750&fit=crop&crop=center';

  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 transform cursor-pointer ${
        isHovered 
          ? 'shadow-lg scale-[1.02] -translate-y-1' 
          : 'hover:shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Status badge */}
      <div className="absolute top-3 left-3 z-20">
        {getStatusIcon()}
      </div>

      {/* Country flag */}
      <div className="absolute top-3 right-3 z-20">
        <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm flex items-center">
          <span className="mr-1">{getCountryFlag(novel.country)}</span>
          <span className="text-xs font-medium">{novel.country}</span>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <img
          src={imageUrl || defaultImage}
          alt={novel.title}
          className={`w-full h-80 object-cover transition-all duration-300 ${
            isHovered ? 'scale-105' : ''
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        
        {/* Gradient overlay */}
        <div className={`absolute inset-0 transition-all duration-300 ${
          isHovered 
            ? 'bg-gradient-to-t from-black/20 via-transparent to-transparent' 
            : 'bg-black/0'
        }`} />
        
        {/* Play button overlay for transmision */}
        {novel.status === 'transmision' && isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600/90 backdrop-blur-sm text-white p-4 rounded-full shadow-xl animate-pulse">
              <Play className="h-6 w-6 ml-1" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 relative">
        <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 transition-all duration-300 ${
          isHovered 
            ? 'text-purple-700' 
            : 'text-gray-900'
        }`}>
          {novel.title}
        </h3>
        
        <div className="flex items-center space-x-4 text-gray-500 text-sm mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{novel.year}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{novel.chapters} cap.</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
            {novel.genre}
          </span>
          <div className="flex items-center text-gray-500 text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{novel.country}</span>
          </div>
        </div>
        
        {novel.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {novel.description}
          </p>
        )}
        
        {/* Trending indicator */}
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            novel.trendingType === 'day' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            🔥 Tendencia {novel.trendingType === 'day' ? 'Hoy' : 'Semanal'}
          </div>
          
          <div className="text-xs text-gray-500">
            {new Date(novel.addedToTrending).toLocaleDateString('es-ES')}
          </div>
        </div>
      </div>
    </div>
  );
}