export default class Helper {
  static sanitizeUrl = (url: string) => {
    return url.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
  };
}