const cache = new Map();

export const createCache = (id: string, content: string) => {
  cache.set(id, content);
};

export const getCache = (id: string) => {
  return cache.get(id);
};
