import { PageTemplate, PrebuiltBlock, TemplateCategory } from '../../types';

export const ALL_PAGE_TEMPLATES: PageTemplate[] = [];

export const ALL_PREBUILT_BLOCKS: PrebuiltBlock[] = [];

export interface CategoryInfo {
  id: TemplateCategory | 'all';
  label: string;
  icon: string;
  description: string;
}

export const TEMPLATE_CATEGORIES: CategoryInfo[] = [
  { id: 'all', label: 'All Templates', icon: 'Sparkles', description: 'Browse all full-page layouts & prebuilt blocks' },
  { id: 'opening', label: 'Opening', icon: 'Sparkles', description: 'Cover pages, image entrances & video openings' },
  { id: 'wedding', label: 'Wedding', icon: 'Heart', description: 'Couple details, bride, groom, ceremony & reception' },
  { id: 'event', label: 'Event', icon: 'Calendar', description: 'Date & time, venue, map, dress code & timelines' },
  { id: 'media', label: 'Media', icon: 'ImageIcon', description: 'Photo galleries, image collages & video sections' },
  { id: 'interaction', label: 'Interaction', icon: 'MessageSquare', description: 'RSVP forms, guestbook, wishes & organizers' },
  { id: 'final', label: 'Final', icon: 'HeartHandshake', description: 'Thank you messages, closing seals & hashtags' }
];

export const getTemplatesByCategory = (category: TemplateCategory | 'all'): PageTemplate[] => {
  if (category === 'all') return ALL_PAGE_TEMPLATES;
  return ALL_PAGE_TEMPLATES.filter((t) => t.category === category);
};

export const getBlocksByCategory = (category: TemplateCategory | 'all'): PrebuiltBlock[] => {
  if (category === 'all') return ALL_PREBUILT_BLOCKS;
  return ALL_PREBUILT_BLOCKS.filter((b) => b.category === category);
};
