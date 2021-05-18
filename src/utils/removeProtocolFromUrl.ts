const removeProtocolFromUrl = (url: string): string =>
  url.replace(/^(https?:\/\/)?(?:www\.)?/, '');

export default removeProtocolFromUrl;
