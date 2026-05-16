import React, { useState } from "react";

interface AssetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  fallbackClassName?: string;
}

export const AssetImage: React.FC<AssetImageProps> = ({ src, alt, className, fallbackText, fallbackClassName, ...props }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div 
        className={`flex items-center justify-center bg-card text-card-foreground border border-border rounded font-bold text-sm text-center p-2 ${className || ''} ${fallbackClassName || ''}`}
        data-testid={`asset-fallback-${fallbackText || 'image'}`}
      >
        {fallbackText || "Image placeholder"}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt || "Asset"} 
      className={className} 
      onError={() => setError(true)}
      {...props} 
    />
  );
};
