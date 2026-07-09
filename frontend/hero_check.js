const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/hero_before_full.png' });
  const scene = await page.$('#heroSliderScene');
  if (scene) await scene.screenshot({ path: '/tmp/hero_slider.png' });
  const activeSlide = await page.$('.slide[data-pos="0"] .slide-card');
  if (activeSlide) await activeSlide.screenshot({ path: '/tmp/hero_active_card.png' });
  await browser.close();
})();
