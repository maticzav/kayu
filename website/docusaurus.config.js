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
    navbar: {
      title: 'Kayu',
      logo: {
        alt: 'Kayu',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/maticzav/kayu',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
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
          editUrl: 'https://github.com/maticzav/kayu/edit/main/website/docs',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/maticzav/kayu/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
