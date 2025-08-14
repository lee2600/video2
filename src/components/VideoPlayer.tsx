import React, { useState } from 'react';
import { ExternalLink, Play, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoKey: string;
  title: string;
}

export function VideoPlayer({ videoKey, title }: VideoPlayerProps) {
  const [showIframe, setShowIframe] = useState(false);
  const [hasIframeError, setHasIframeError] = useState(false);

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoKey}`;
  const embedUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin=${window.location.origin}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`;

  const openInYouTube = () => {
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePlayClick = () => {
    setShowIframe(true);
  };

  const handleIframeError = () => {
    setHasIframeError(true);
  };

  if (showIframe && hasIframeError) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        />
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
          <div className="text-center text-white p-6">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm opacity-90 mb-4">
              YouTube ha bloqueado la reproducción del video
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

  if (showIframe) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onError={handleIframeError}
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

  // Default state: Show thumbnail with play button
  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group" onClick={handlePlayClick}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-red-600 hover:bg-red-700 rounded-full p-6 transition-all group-hover:scale-110 shadow-2xl">
          <Play className="h-12 w-12 text-white ml-1" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 text-white">
        <p className="font-medium text-lg">{title}</p>
        <p className="text-sm opacity-75">Haz clic para reproducir</p>
      </div>
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