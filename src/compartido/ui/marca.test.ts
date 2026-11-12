import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { LogoMarca, MonogramaMarca } from '.'

describe.each([['LogoMarca', LogoMarca], ['MonogramaMarca', MonogramaMarca]])('%s', (_n, C) => {
  it('tiene nombre accesible BlackHellHeim y usa currentColor', () => {
    const svg = mount(C).get('svg')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('BlackHellHeim')
    expect(svg.attributes('fill')).toBe('currentColor')
    expect(svg.html()).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
  })
})
