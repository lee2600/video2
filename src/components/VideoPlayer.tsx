import React, { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';

interface VideoPlayerProps {
  videoKey: string;
  title: string;
}

export function VideoPlayer({ videoKey, title }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoKey}`;
  const embedUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=0&rel=0&modestbranding=1&playsinline=1`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`;

  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const openInYouTube = () => {
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  if (hasError) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
          <div className="text-center text-white p-6">
            <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm opacity-90 mb-4">
              No se puede reproducir el video aquí
            </p>
            <button
              onClick={openInYouTube}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Ver en YouTube
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Cargando video...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        onError={handleIframeError}
        onLoad={handleIframeLoad}
        referrerPolicy="strict-origin-when-cross-origin"
      />
      
      {/* Fallback button overlay */}
      <div className="absolute top-4 right-4">
        <button
          onClick={openInYouTube}
          className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors"
          title="Abrir en YouTube"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}