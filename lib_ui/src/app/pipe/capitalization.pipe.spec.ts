import { CapitalizationPipe } from './capitalization.pipe';

describe('CapitalizationPipe', () => {
  it('create an instance', () => {
    const pipe = new CapitalizationPipe();
    expect(pipe).toBeTruthy();
  });
});
