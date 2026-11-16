'use client';

// Tiny shopping-bag store kept in sessionStorage and broadcast with a window event.

const KEY = 'vayne-bag';
export const BAG_EVENT = 'vayne-bag';

export function getBag() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function save(items) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function addToBag(item) {
  const items = getBag();
  const hit = items.find((i) => i.k === item.k && i.size === item.size);
  if (hit) hit.q += 1;
  else items.push({ ...item, q: 1 });
  save(items);
  window.dispatchEvent(new CustomEvent(BAG_EVENT, { detail: { b: items, open: true } }));
}

export function setBag(items) {
  save(items);
  window.dispatchEvent(new CustomEvent(BAG_EVENT, { detail: { b: items } }));
}
