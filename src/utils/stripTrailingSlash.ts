const stripTrailingSlash = (url: string) =>
  url.endsWith('/') ? url.slice(0, -1) : url;

export default stripTrailingSlash;
