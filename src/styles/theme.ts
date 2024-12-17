export const theme = {
  colors: {
    // 主色调 - 紫色系
    primary: {
      50: 'rgba(147, 51, 234, 0.05)',
      100: 'rgba(147, 51, 234, 0.1)',
      200: 'rgba(147, 51, 234, 0.2)',
      300: 'rgba(147, 51, 234, 0.3)',
      400: 'rgba(147, 51, 234, 0.4)',
      500: 'rgba(147, 51, 234, 0.5)',
      600: 'rgba(147, 51, 234, 0.6)',
      700: 'rgba(147, 51, 234, 0.7)',
      800: 'rgba(147, 51, 234, 0.8)',
      900: 'rgba(147, 51, 234, 0.9)',
    },
    // 强调色 - 黄色系
    accent: {
      light: 'rgba(250, 204, 21, 0.1)',
      default: 'rgba(250, 204, 21, 0.8)',
      dark: 'rgba(250, 204, 21, 1)',
    },
    // 背景色
    background: {
      primary: '#000000',
      secondary: '#1a1a1a',
      tertiary: 'rgba(26, 26, 26, 0.5)',
    },
    // 文字颜色
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
    }
  },
  gradients: {
    // 紫色渐变
    purple: {
      soft: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(126, 34, 206, 0.1) 100%)',
      medium: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(126, 34, 206, 0.3) 100%)',
      strong: 'linear-gradient(135deg, rgba(147, 51, 234, 0.5) 0%, rgba(126, 34, 206, 0.5) 100%)',
    },
    // 黄色渐变
    yellow: {
      soft: 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, rgba(234, 179, 8, 0.1) 100%)',
      medium: 'linear-gradient(135deg, rgba(250, 204, 21, 0.3) 0%, rgba(234, 179, 8, 0.3) 100%)',
      strong: 'linear-gradient(135deg, rgba(250, 204, 21, 0.5) 0%, rgba(234, 179, 8, 0.5) 100%)',
    }
  }
}; 