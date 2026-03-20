/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://clocksandalarmsonline.com',
  generateRobotsTxt: true,
  exclude: ['/legacy/*'],
  outDir: 'public',
}
