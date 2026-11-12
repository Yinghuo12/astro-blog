import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { getNavLinks } from './constants/link-presets'

export const siteConfig: SiteConfig = {
  title: 'Yinghuo',
  subtitle: '主页',
  lang: 'zh_CN',         // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko'
  themeColor: {
    hue: 250,         // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: false,     // Hide the theme color picker for visitors
  },
  banner: {
    enable: true,
    src: {
      light: 'assets/images/day.png',   // 白天 banner
      dark: 'assets/images/night.jpeg', // 黑夜 banner
    },
    position: 'center 62%', // Equivalent to object-position, 默认略偏下，多保留画面下方内容
    credit: {
      enable: false,         // Display the credit text of the banner image
      text: '',              // Credit text to be displayed
      url: ''                // (Optional) URL link to the original artwork or artist's page
    },
    carousel: {
      enable: true,          // Enable carousel when multiple images are provided
      interval: 5,           // Image switch interval in seconds
      animation: 'fade'      // Animation: 'fade', 'slide', or 'zoom'
    },
    text: {
      title: 'Yinghuo',      // Site title displayed on banner
      message: '欢迎来到我的个人博客'  // Message displayed below title
    }
  },
  favicon: [    // Leave this array empty to use the default favicon
    // {
    //   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
    //   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
    //   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
    // }
  ]
}

const navLinks = getNavLinks()

export const navBarConfig: NavBarConfig = {
  links: [
    navLinks.home,
    navLinks.archive,
    navLinks.my,
    navLinks.about,
    navLinks.others,
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/demo-avatar.png',  // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  name: 'Yinghuo',
  bio: '欢迎来到我的个人博客.',
  links: [
    {
      name: 'QQ',
      icon: 'fa6-brands:qq',
      url: 'tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=654829830&website=www.oicqzone.com',
    },
    {
      name: 'LeetCode',
      icon: 'simple-icons:leetcode',
      url: 'https://leetcode.cn/u/yu-guangchao/',
    },
    {
      name: 'Bilibili',
      icon: 'fa6-brands:bilibili',       // Visit https://icones.js.org/ for icon codes
                                        // You will need to install the corresponding icon set if it's not already included
                                        // `pnpm add @iconify-json/<icon-set-name>`
      url: 'https://space.bilibili.com/60689612?spm_id_from=333.1007.0.0',
    },
    {
      name: 'Steam',
      icon: 'fa6-brands:steam',
      url: 'https://steamcommunity.com/profiles/76561199003431885/',
    },
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/Yinghuo12',
    },
    {
      name: '小红书',
      icon: 'simple-icons:xiaohongshu',
      url: 'https://www.xiaohongshu.com/user/profile/65b32aa8000000000e000670',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
