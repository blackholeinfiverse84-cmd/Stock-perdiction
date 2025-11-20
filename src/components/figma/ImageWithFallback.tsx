import React, { useState } from 'react';

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(props.src);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+');
    }
  };

  return <img {...props} src={imgSrc} onError={handleError} />;
}

