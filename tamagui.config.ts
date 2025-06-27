import { createTamagui } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'
import { themes } from '@tamagui/themes'
import { config as configBase } from '@tamagui/config-base'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from 'tamagui'

const headingFont = createInterFont({
  size: {
    6: 15,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    6: '400',
    7: '700',
  },
  color: {
    6: '$colorFocus',
    7: '$color',
  },
  letterSpacing: {
    5: 2,
    6: 5,
  },
}, {
  size: {
    fontStack: {
      '6': {
        fontSize: 16,
        lineHeight: 24,
      },
    },
  },
})

const bodyFont = createInterFont({
  size: {
    6: 15,
  },
  weight: {
    6: '400',
    7: '700',
  },
  color: {
    6: '$colorFocus',
    7: '$color',
  },
  letterSpacing: {
    5: 2,
    6: 5,
  },
})

const config = createTamagui({
  ...configBase,
  themes,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerFine: { pointer: 'fine' },
  }),
})

declare module 'tamagui' {
  interface TamaguiCustomConfig extends typeof config {}
}
export default config
