import { describe, it, expect } from 'vitest';
import { KEYBOARD_KEY } from '../../shared/constants/event';

describe('KEYBOARD_KEY', () => {
  it('left is ArrowLeft', () => expect(KEYBOARD_KEY.left).toBe('ArrowLeft'));
  it('right is ArrowRight', () => expect(KEYBOARD_KEY.right).toBe('ArrowRight'));
  it('backspace is Backspace', () => expect(KEYBOARD_KEY.backspace).toBe('Backspace'));
  it('home is Home', () => expect(KEYBOARD_KEY.home).toBe('Home'));
  it('end is End', () => expect(KEYBOARD_KEY.end).toBe('End'));
});
