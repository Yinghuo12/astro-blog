import type { LIGHT_MODE, DARK_MODE, AUTO_MODE } from '@constants/constants'

export type SiteConfig = {
  title: string
  subtitle: string

  lang: string

  themeColor: {
    hue: number
    fixed: boolean
  }
  banner: {
    enable: boolean
    src: string | { light: string | string[], dark: string | string[] }
    position?: string
    credit: {
      enable: boolean
      text: string
      url?: string
    }
    carousel?: {
      enable: boolean
      interval?: number  // 切换间隔（秒），默认 5
      animation?: 'fade' | 'slide' | 'zoom'  // 切换动画，默认 fade
    }
    text?: {
      title?: string
      message?: string
    }
  }

  favicon: Favicon[]
}

export type Favicon = {
  src: string
  theme?: 'light' | 'dark'
  sizes?: string
}

export enum LinkPreset {
  Home = 0,
  Archive = 1,
  About = 2,
}

export type NavBarLink = {
  name: string
  url?: string
  external?: boolean
  children?: NavBarLink[]
}

export type NavBarConfig = {
  links: (NavBarLink | LinkPreset)[]
}

export type ProfileConfig = {
  avatar?: string
  name: string
  bio?: string
  links: {
    name: string
    url: string
    icon: string
  }[]
}

export type LicenseConfig = {
  enable: boolean
  name: string
  url: string
}

export type LIGHT_DARK_MODE =
  | typeof LIGHT_MODE
  | typeof DARK_MODE
  | typeof AUTO_MODE
