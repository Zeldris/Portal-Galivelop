import { describe, expect, it } from 'vitest';
import { leerAncla } from './ancla';

describe('leerAncla', () => {
  it('quita la almohadilla y decodifica', () => {
    expect(leerAncla('#ap-%C3%B1u')).toBe('ap-ñu');
    expect(leerAncla('')).toBe('');
  });

  it('devuelve un ancla cortada tal cual en vez de lanzar URIError', () => {
    expect(leerAncla('#%E0%A4%A')).toBe('%E0%A4%A');
  });
});
