declare module 'fit-file-parser' {
  interface FitParserOptions {
    force?: boolean;
    speedUnit?: 'm/s' | 'km/h' | 'mph';
    lengthUnit?: 'm' | 'km' | 'mi';
    temperatureUnit?: 'celsius' | 'fahrenheit' | 'kelvin';
    pressureUnit?: 'bar' | 'cbar' | 'psi';
    elapsedRecordField?: boolean;
    mode?: 'cascade' | 'list' | 'both';
  }

  interface FitParserData {
    [key: string]: unknown;
  }

  class FitParser {
    constructor(options?: FitParserOptions);
    parse(
      buffer: ArrayBuffer | Buffer,
      callback: (error: Error | null, data?: FitParserData) => void
    ): void;
  }

  export default FitParser;
}
