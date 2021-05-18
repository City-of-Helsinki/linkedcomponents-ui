const removeProtocolFromUrl = (url: string): string =>
  url.replace(/^(https?:\/\/\.?)/, '');

export default removeProtocolFromUrl;
