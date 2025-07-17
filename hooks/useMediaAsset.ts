import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { useEffect, useState, useCallback, useMemo } from 'react';

interface UseMediaAssetParams {
  type: MediaType;
  company?: CompanyType;
  user?: UserType;
  fallback?: string;
}

interface UseMediaAssetResult {
  media: string;
  loading: boolean;
  clearCache: () => void;
}

const DEFAULT_FALLBACKS: Record<MediaType, string> = {
  logo: '/images/logo-fallback.png',
  avatar: '',
  signature: '/images/signature-fallback.png',
  'login-background': '/images/background-fallback.png',
  favicon: '',
};

const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(type: MediaType, id: string | number) {
  return `media-${type}-${id}`;
}

export function useMediaAsset({
  type,
  company,
  user,
  fallback,
}: UseMediaAssetParams): UseMediaAssetResult {
  const [media, setMedia] = useState<string>(
    fallback ?? DEFAULT_FALLBACKS[type]
  );
  const [loading, setLoading] = useState<boolean>(false);

  const { id, initialData } = useMemo(() => {
    let id: string | number | undefined;
    let initialData: string | undefined;

    switch (type) {
      case 'logo':
        id = company?.id;
        initialData = company?.company_logo;
        break;
      case 'login-background':
        id = company?.id;
        initialData = company?.login_background;
        break;
      case 'avatar':
        id = user?.id;
        initialData = user?.avatar;
        break;
      case 'signature':
        id = user?.id;
        initialData = user?.signature;
        break;
      case 'favicon':
        // no-op
        break;
    }

    return { id, initialData };
  }, [type, company, user]);

  const cacheKey = useMemo(() => {
    return id ? getCacheKey(type, id) : '';
  }, [type, id]);

  const clearCache = useCallback(() => {
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
    }
  }, [cacheKey]);

  const fetchMedia = useCallback(() => {
    if (!id || !initialData) return;

    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const isExpired = Date.now() - parsed.timestamp > CACHE_EXPIRATION_MS;

        if (!isExpired && parsed.media) {
          setMedia(parsed.media);
          return;
        }
      } catch {
        // Ignore corrupt cache
      }
    }

    setLoading(true);
    let retries = 3;

    const attemptFetch = () => {
      API.get('/media', {
        type,
        parent_id: id,
      })
        .then((res) => {
          const mediaUrl =
            res?.data?.data ?? fallback ?? DEFAULT_FALLBACKS[type];
          setMedia(mediaUrl);

          localStorage.setItem(
            cacheKey,
            JSON.stringify({ media: mediaUrl, timestamp: Date.now() })
          );
        })
        .catch(() => {
          if (retries > 0) {
            retries -= 1;
            attemptFetch();
          } else {
            notify({
              title: 'Failed',
              message: `Failed to load ${type} after multiple retries.`,
              color: 'red',
            });
            setLoading(false);
          }
        })
        .finally(() => setLoading(false));
    };

    attemptFetch();
  }, [type, id, initialData, cacheKey, fallback]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { media, loading, clearCache };
}
