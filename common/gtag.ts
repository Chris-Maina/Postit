import { GTagEvent } from './interfaces';
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
// add page_path i.e pathname, to the default pageview config
export const pageView = (url:  URL): void => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url
  });
};

export const gtagEvent = ({ action, category, label, value }: GTagEvent): void => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
