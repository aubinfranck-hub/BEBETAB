/** Teste scripts/elevenlabs-info.ts contre un faux serveur (format des réponses d'après la documentation). */
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
import path from 'node:path';
import {after, before, describe, it} from 'node:test';

const projectRoot = path.join(__dirname, '..');

describe('elevenlabs-info (faux serveur)', () => {
  let server: http.Server;
  let baseUrl: string;
  const urls: string[] = [];
  let limit = 100000;

  function run(args: string[], env: Record<string, string> = {}): Promise<{code: number | null; output: string}> {
    return new Promise(resolve => {
      const child = spawn(path.join(projectRoot, 'node_modules', '.bin', 'tsx'), [path.join(projectRoot, 'scripts', 'elevenlabs-info.ts'), ...args], {
        cwd: projectRoot,
        env: {...process.env, ELEVENLABS_API_KEY: 'secret-test-key', ELEVENLABS_BASE_URL: baseUrl, ...env},
      });
      let output = '';
      child.stdout.on('data', chunk => (output += chunk));
      child.stderr.on('data', chunk => (output += chunk));
      child.on('close', code => resolve({code, output}));
    });
  }

  before(async () => {
    server = http.createServer((req, res) => {
      urls.push(req.url ?? '');
      if (req.headers['xi-api-key'] !== 'secret-test-key') {
        res.writeHead(401).end('{}');
        return;
      }
      const json = (body: unknown) => res.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify(body));
      if (req.url?.startsWith('/v2/voices')) {
        json({
          voices: [
            {voice_id: 'v-fr', name: 'Awa', category: 'professional', preview_url: 'https://example.test/awa.mp3', labels: {accent: 'african', language: 'fr', gender: 'female'}},
            {voice_id: 'v-en', name: 'Brian', category: 'premade', preview_url: null, labels: {accent: 'american', language: 'en'}},
          ],
          has_more: false,
        });
      } else if (req.url === '/v1/user/subscription') {
        json({character_count: 1200, character_limit: limit, next_character_count_reset_unix: 1800000000});
      } else {
        res.writeHead(404).end();
      }
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  after(() => server.close());

  it('liste les voix avec id, accent et lien d\'écoute, sans jamais afficher la clé', async () => {
    const {code, output} = await run(['voices']);
    assert.equal(code, 0, output);
    assert.match(output, /Awa[\s\S]*id\s+: v-fr/);
    assert.match(output, /accent=african/);
    assert.match(output, /https:\/\/example\.test\/awa\.mp3/);
    assert.match(output, /Brian/);
    assert.ok(!output.includes('secret-test-key'));
  });

  it('--fr ne garde que les voix françaises et le mot-clé part dans la recherche', async () => {
    const {code, output} = await run(['voices', 'african', '--fr']);
    assert.equal(code, 0, output);
    assert.match(output, /Awa/);
    assert.ok(!output.includes('Brian'));
    assert.ok(urls.some(url => url.includes('search=african') && url.includes('page_size=100')));
  });

  it('affiche les caractères utilisés/restants et le besoin de la campagne', async () => {
    const {code, output} = await run(['usage', 'scan-express']);
    assert.equal(code, 0, output);
    assert.match(output, /1200 \/ 100000 \(restants : 98800\)/);
    assert.match(output, /Prochaine remise à zéro : 2027-01-15/);
    assert.match(output, /Voix off de « scan-express » : \d+ caractères/);
    assert.match(output, /Crédits suffisants/);
  });

  it('prévient quand les crédits ne suffisent pas', async () => {
    limit = 1300;
    const {code, output} = await run(['usage', 'scan-express']);
    assert.equal(code, 0, output);
    assert.match(output, /⚠ Il manque environ \d+ caractères/);
  });

  it('explique une clé refusée (401) sans la révéler', async () => {
    const {code, output} = await run(['usage'], {ELEVENLABS_API_KEY: 'mauvaise-cle'});
    assert.equal(code, 1);
    assert.match(output, /ElevenLabs 401 sur \/v1\/user\/subscription \(clé invalide/);
    assert.ok(!output.includes('mauvaise-cle'));
  });

  it('échoue clairement sans clé', async () => {
    const {code, output} = await run(['voices'], {ELEVENLABS_API_KEY: ''});
    assert.equal(code, 1);
    assert.match(output, /ELEVENLABS_API_KEY est requis/);
  });
});
