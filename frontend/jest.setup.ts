import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (globalThis as any).TextEncoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).TextEncoder = TextEncoder;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (globalThis as any).TextDecoder === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).TextDecoder = TextDecoder;
}
