import type { Category } from './types';

export type CategoryChildren = Map<number | null, Category[]>;

export const buildChildrenMap = (categories: Category[]): CategoryChildren => {
  const map: CategoryChildren = new Map();

  for (const category of categories) {
    const siblings = map.get(category.parentId);

    if (siblings) {
      siblings.push(category);
    } else {
      map.set(category.parentId, [category]);
    }
  }

  for (const siblings of map.values()) {
    siblings.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
    );
  }

  return map;
};
