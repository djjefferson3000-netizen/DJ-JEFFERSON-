import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getYouTubeEmbedUrl,
  filterAndSortItems,
  validatePortfolioItem,
  getAccentClasses,
  extractEpisodeBadge,
  formatReadableDate,
  checkIsAdminMode,
  generatePortfolioLinks,
} from './portfolioLogic';
import { PortfolioItem } from '../types/portfolio';

const mockItems: PortfolioItem[] = [
  {
    id: 'item-1',
    title: 'DJ Jefferson Live Session ep.1',
    category: 'live-session',
    date: '2026-01-13',
    venue: 'DUEM',
    city: 'Mahasarakham',
    imageUrl: 'https://cdn.example.com/img1.jpg',
    videoUrl: 'https://youtu.be/7jrrU0JU9RQ?si=test',
    description: 'First episode of 2026 live sessions',
    tags: ['Live', 'Hiphop', 'Duem'],
    featured: true,
  },
  {
    id: 'item-2',
    title: 'Weekly Recap at Jess',
    category: 'recap',
    date: '2026-08-14',
    venue: 'JESS',
    city: 'Mahasarakham',
    imageUrl: 'https://cdn.example.com/img2.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=OBqVELH4g8o',
    description: 'Weekly recap video party',
    tags: ['Recap', 'Club', 'Jess'],
    featured: false,
  },
  {
    id: 'item-3',
    title: 'Songkran Festival Roo Kalasin',
    category: 'club-set',
    date: '2026-04-14',
    venue: 'Roo Kalasin',
    city: 'Kalasin',
    imageUrl: 'https://cdn.example.com/img3.jpg',
    description: 'Special guest show',
    tags: ['Festival', 'Songkran'],
    featured: false,
  },
];

test('getYouTubeEmbedUrl correctly converts youtu.be shortlinks', () => {
  const result = getYouTubeEmbedUrl('https://youtu.be/7jrrU0JU9RQ?si=EbVXOlNMMQqH1RXO');
  assert.equal(result, 'https://www.youtube.com/embed/7jrrU0JU9RQ?autoplay=1&rel=0');
});

test('getYouTubeEmbedUrl correctly converts youtube.com/watch links', () => {
  const result = getYouTubeEmbedUrl('https://www.youtube.com/watch?v=OBqVELH4g8o');
  assert.equal(result, 'https://www.youtube.com/embed/OBqVELH4g8o?autoplay=1&rel=0');
});

test('getYouTubeEmbedUrl returns null for empty or invalid input', () => {
  assert.equal(getYouTubeEmbedUrl(''), null);
  assert.equal(getYouTubeEmbedUrl(undefined), null);
});

test('extractEpisodeBadge formats ep.1 into EP.01', () => {
  assert.equal(extractEpisodeBadge('dj jefferson LIVE session ep.1'), 'EP.01');
  assert.equal(extractEpisodeBadge('LIVE session ep.14'), 'EP.14');
  assert.equal(extractEpisodeBadge('Weekly Recap at Jess'), null);
});

test('formatReadableDate formats YYYY-MM-DD into readable date', () => {
  assert.equal(formatReadableDate('2026-01-13'), '13 ม.ค. 2026');
  assert.equal(formatReadableDate('2026-08-14'), '14 ส.ค. 2026');
  assert.equal(formatReadableDate('14 August 2026'), '14 August 2026');
});

test('checkIsAdminMode correctly parses url params and hash', () => {
  assert.equal(checkIsAdminMode('?admin=1', '/', ''), true);
  assert.equal(checkIsAdminMode('', '/admin', ''), true);
  assert.equal(checkIsAdminMode('', '/', '#admin'), true);
  assert.equal(checkIsAdminMode('', '/', ''), false);
});

test('generatePortfolioLinks creates viewer and editor links', () => {
  const links = generatePortfolioLinks('https://example.com');
  assert.equal(links.viewerUrl, 'https://example.com/');
  assert.equal(links.editorUrl, 'https://example.com/?admin=1');
});

test('filterAndSortItems filters by category', () => {
  const filtered = filterAndSortItems(mockItems, { category: 'live-session' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'item-1');
});

test('filterAndSortItems searches across venue and tags', () => {
  const searchVenue = filterAndSortItems(mockItems, { search: 'kalasin' });
  assert.equal(searchVenue.length, 1);
  assert.equal(searchVenue[0].id, 'item-3');

  const searchTag = filterAndSortItems(mockItems, { search: 'Hiphop' });
  assert.equal(searchTag.length, 1);
  assert.equal(searchTag[0].id, 'item-1');
});

test('filterAndSortItems sorts by date-desc and featured', () => {
  const byDate = filterAndSortItems(mockItems, { sortBy: 'date-desc' });
  assert.equal(byDate[0].id, 'item-2');

  const byFeatured = filterAndSortItems(mockItems, { sortBy: 'featured' });
  assert.equal(byFeatured[0].id, 'item-1');
});

test('validatePortfolioItem identifies missing required fields', () => {
  const invalid = validatePortfolioItem({
    title: '',
    imageUrl: '',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.title);
  assert.ok(invalid.errors.imageUrl);

  const valid = validatePortfolioItem({
    title: 'New Set',
    category: 'live-session',
    date: '2026-03-01',
    imageUrl: 'https://example.com/flyer.png',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('getAccentClasses returns valid css class mappings', () => {
  const amber = getAccentClasses('amber');
  assert.ok(amber.text.includes('amber'));
  const cyan = getAccentClasses('cyan');
  assert.ok(cyan.text.includes('cyan'));
});
