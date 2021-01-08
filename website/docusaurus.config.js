module.exports = {
  title: 'Kayu',
  tagline: 'GraphQL client that lets you forget about GraphQL.',
  url: 'https://kayujs.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'maticzav', // Usually your GitHub org/user name.
  projectName: 'kayu', // Usually your repo name.
  themeConfig: {
    // Navifation
    navbar: {
      title: 'KayuJS',
      logo: {
        alt: 'KayuJS',
        src: 'img/logo.png',
      },
      items: [
        {
          to: '/docs/',
          activeBasePath: 'docs',
          label: 'Documentation',
          position: 'left',
        },
        { to: '/blog/', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/maticzav/kayu/discussions',
          label: 'Forum',
          position: 'left',
        },
        {
          href: 'https://github.com/maticzav/kayu',
          label: 'GitHub',
          position: 'left',
        },
      ],
    },
    // Footer
    footer: {
      style: 'light',
      links: [
        {
          title: 'Follow KayuJS',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/maticzav',
            },
            {
              label: 'Twitter',
              to: 'https://twitter.com/maticzav',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Matic Zavadlal`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/maticzav/kayu/edit/main/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/maticzav/kayu/edit/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
