import { useEffect } from 'react';
import { APP_CONFIG, generatePageTitle, generateMetaDescription, generateMetaKeywords } from '@shared/config';

type PageKey = keyof typeof APP_CONFIG.pages;

const PAGE_METADATA = {
  home: {
    title: 'Musical Events Discovery Platform',
    description: 'Discover extraordinary musical experiences worldwide'
  },
  eventsPublic: {
    title: 'Events - Musical Events Discovery',
    description: 'Browse all public musical events and experiences'
  },
  map: {
    title: 'World Map - Musical Events Discovery',
    description: 'Explore musical events worldwide on an interactive map'
  },
  dashboard: {
    title: 'Dashboard - Musical Events Discovery',
    description: 'Manage your musical events and experiences'
  }
};

export function usePageMetadata(pageKey: PageKey, customTitle?: string, customDescription?: string) {
  useEffect(() => {
    // Set page title
    const title = customTitle || generatePageTitle(pageKey);
    document.title = title;

    // Set meta description
    const description = customDescription || generateMetaDescription(pageKey);
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Set meta keywords
    const keywords = generateMetaKeywords(pageKey);
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // Set Open Graph meta tags
    const setOpenGraphMeta = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    setOpenGraphMeta('og:title', title);
    setOpenGraphMeta('og:description', description);
    setOpenGraphMeta('og:type', 'website');
    setOpenGraphMeta('og:site_name', APP_CONFIG.name);
    setOpenGraphMeta('og:url', window.location.href);

    // Set Twitter meta tags
    const setTwitterMeta = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    setTwitterMeta('twitter:card', 'summary_large_image');
    setTwitterMeta('twitter:title', title);
    setTwitterMeta('twitter:description', description);
    if (APP_CONFIG.social.twitter) {
      setTwitterMeta('twitter:site', APP_CONFIG.social.twitter);
    }
  }, [pageKey, customTitle, customDescription]);
}