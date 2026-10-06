const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const sharp = require(require.resolve('sharp', { paths:[path.join(__dirname,'../frontend')] }));
(async () => {
  const results = [];
  for (const width of [320,390,768,1440]) {
    const region = { left:0,top:0,width,height:81 };
    const before = await sharp(path.join(__dirname,'headers/before',`landing-${width}.png`)).extract(region).raw().toBuffer();
    const after = await sharp(path.join(__dirname,'headers/after',`landing-${width}.png`)).extract(region).raw().toBuffer();
    let changed = 0; for (let i = 0; i < before.length; i++) if (before[i] !== after[i]) changed++;
    results.push({ width, headerHeight:81, changedChannels:changed, totalChannels:before.length });
    assert.equal(changed,0, `Header da landing ${width}px mudou`);
  }
  const drawerRegion = { left:0,top:0,width:331,height:844 };
  const drawerBefore = await sharp(path.join(__dirname,'headers/before/landing-menu.png')).extract(drawerRegion).raw().toBuffer();
  const drawerAfter = await sharp(path.join(__dirname,'headers/after/landing-menu-mouse.png')).extract(drawerRegion).raw().toBuffer();
  assert.ok(drawerBefore.equals(drawerAfter), 'Drawer da landing mudou no mesmo modo de entrada (mouse)');
  results.push({ drawer:'landing', input:'mouse', changedChannels:0 });
  fs.writeFileSync(path.join(__dirname,'headers/landing-visual-results.json'),JSON.stringify(results,null,2));
  console.log('PASS landing: pixels do header e drawer preservados');
})().catch(error => { console.error(error); process.exitCode = 1; });
