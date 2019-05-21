export class Base64 {
  static encode(value: string) {
    return Buffer.from(value).toString('base64');
  }

  static decode(value: string) {
    return Buffer.from(value, 'base64').toString();
  }
}
