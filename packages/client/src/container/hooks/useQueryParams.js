const getQuery = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

const useQueryParams = (keys = []) => {
  const query = getQuery();
  let params;
  if (typeof keys === 'string') {
    params = query.get(keys);
  }
  if (Array.isArray(keys)) {
    const tempKeys = {};
    keys.forEach((key) => {
      tempKeys[key] = query.get(key);
    });
    params = tempKeys;
  }
  return params;
};
export default useQueryParams;
