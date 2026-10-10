const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1536,height:864}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3000');
 const go=async(hash)=>{await page.goto('http://127.0.0.1:3000/#/'+hash);await page.waitForTimeout(200);};
 await page.locator('[data-card=learn]').click();await page.waitForURL('**/#/apprendre');
 await page.locator('[data-card=letters]').click();await page.waitForURL('**/apprendre?activity=alphabet');
 await page.getByRole('button',{name:'Retour',exact:true}).first().click();await page.waitForURL('**/#/apprendre');
 await go('histoires?activity=forest');
 for(let i=0;i<2;i++)await page.getByRole('button',{name:'Page suivante'}).click();
 await page.getByRole('button',{name:'Terminer l’histoire'}).click();
 let user=await page.evaluate(()=>JSON.parse(localStorage.getItem('bebe_tab_user')));assert.equal(user.stars,20);
 await go('defis');await page.getByRole('button',{name:'Recevoir les étoiles',exact:false}).click();user=await page.evaluate(()=>JSON.parse(localStorage.getItem('bebe_tab_user')));assert.equal(user.stars,35);await go('home');await go('defis');assert.equal(await page.getByRole('button',{name:'Recevoir les étoiles',exact:false}).count(),0);assert.ok(await page.getByText('Lecteur Enchanté',{exact:false}).count());
 await go('world');await page.getByRole('button',{name:'Europe',exact:true}).click();await page.getByRole('button',{name:/Paris France/}).click();await page.waitForURL('**/country?country=france');
 await page.getByRole('button',{name:'Tour Eiffel',exact:false}).click();assert.ok(await page.getByRole('dialog').count());await page.getByRole('button',{name:'Ouvrir la bibliothèque'}).click();await page.waitForURL('**/apprendre?activity=histoire');
 await go('dessiner?activity=letters');const canvas=page.locator('canvas').first();assert.ok(await canvas.count());let size=await canvas.evaluate(c=>({w:c.width,h:c.height,rect:c.getBoundingClientRect().width}));assert.ok(size.w>0&&size.h>0);
 const routes=['home','world','country?country=france','apprendre','jouer','histoires','dessiner','musique','recompenses','quiz','defis','mondes','videos','live'];
 for(const viewport of [{width:390,height:844},{width:1024,height:768},{width:3840,height:2160}]){
 await page.setViewportSize(viewport);
 for(const route of routes){await go(route);assert.equal(await page.getByText('Reprenons l’aventure').count(),0,route);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);assert.equal(overflow,false,`${route}: ${viewport.width} horizontal overflow`);if(viewport.width===3840){await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode().catch(()=>{})))});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`design/uhd/${route.split('?')[0]}.png`,fullPage:false});}}
 }
 for(const [endpoint,body] of [['quiz',{subject:'Maths & Chiffres',ageGroup:'5-7'}],['story',{hero:'Un lapin',animal:'Fanti',setting:'Jungle',ageGroup:'5-7'}],['chat',{message:'Bonjour',ageGroup:'5-7'}]]){const response=await page.request.post('http://127.0.0.1:3000/api/fanti/'+endpoint,{data:body});assert.ok(response.ok(),endpoint);const data=await response.json();assert.ok(data,endpoint);}
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: navigation, story rewards, countries, drawing, 42 responsive route checks and 14 UHD screenshots.');
})().catch(e=>{console.error(e);process.exit(1)});
