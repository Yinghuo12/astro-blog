import { LinkPreset, type NavBarLink } from '@/types/config'
import I18nKey from '@i18n/i18nKey'
import { i18n } from '@i18n/translation'

export function getLinkPresets(): { [key in LinkPreset]: NavBarLink } {
  return {
    [LinkPreset.Home]: {
      name: i18n(I18nKey.home),
      url: '/',
    },
    [LinkPreset.About]: {
      name: i18n(I18nKey.about),
      url: '/about/',
    },
    [LinkPreset.Archive]: {
      name: i18n(I18nKey.archive),
      url: '/archive/',
    },
  }
}

// 导航栏链接定义（函数形式，避免循环依赖）
export function getNavLinks() {
  return {
    home: { name: '主页', url: '/' },
    links: {
      name: 'Links',
      children: [
        { name: 'GitHub', url: 'https://github.com/Yinghuo12', external: true },
        { name: 'Bilibili', url: 'https://space.bilibili.com/60689612?spm_id_from=333.1007.0.0', external: true },
      ]
    } as NavBarLink,
    my: {
      name: '我的',
      children: [
        { name: '电影', url: '/movies/' },
        { name: '日记', url: '/diary/' },
        { name: '相片', url: '/gallery/' },
      ]
    } as NavBarLink,
    about: {
      name: '关于',
      children: [
        { name: '关于我', url: '/about/' },
        { name: '朋友', url: '/friends/' },
        { name: '关于小站', url: '/changelog/' },
      ]
    } as NavBarLink,
    others: {
      name: '其他',
      url: '/others/',
    } as NavBarLink,
  }
}
