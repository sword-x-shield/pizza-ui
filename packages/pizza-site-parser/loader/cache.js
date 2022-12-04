const cache = new Map();

export const createCache = (id, content) => {
  cache.set(id, content);
};

export const getCache = (id) => {
  return cache.get(id);
};
