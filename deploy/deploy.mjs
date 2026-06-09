#!/usr/bin/env node
'use strict';

const { readFileSync, existsSync } = require('fs');
const { Client } = require('ssh2');
const path = require('path');

const HOST = '5.189.157.30';
const USER = 'root';
const ROOT = path.join(__dirname, '..');

const password =
  process.env.SSH_PASSWORD ||
  process.env.DEPLOY_SSH_PASSWORD ||
  (existsSync(path.join(__dirname, '.ssh-password'))
    ? readFileSync(path.join(__dirname, '.ssh-password'), 'utf8').trim()
    : '');

if (!password) {
  console.error('Missing SSH password. Set SSH_PASSWORD env var or create deploy/.ssh-password (one line, not committed).');
  process.exit(1);
}

const tarPath = path.join(__dirname, 'get-consult-site.tar.gz');
const nginxConf = readFileSync(path.join(__dirname, 'nginx-get-consult.conf'));
const setupSh = readFileSync(path.join(__dirname, 'setup-server.sh'));

const conn = new Client();

conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;

    const uploads = [
      { local: tarPath, remote: '/tmp/get-consult-site.tar.gz' },
      { local: path.join(__dirname, 'nginx-get-consult.conf'), remote: '/tmp/nginx-get-consult.conf' },
      { local: path.join(__dirname, 'setup-server.sh'), remote: '/tmp/setup-server.sh' },
    ];

    let i = 0;
    const next = () => {
      if (i >= uploads.length) {
        conn.exec('chmod +x /tmp/setup-server.sh && bash /tmp/setup-server.sh /tmp/get-consult-site.tar.gz', (e, stream) => {
          if (e) throw e;
          stream.on('data', (d) => process.stdout.write(d));
          stream.stderr.on('data', (d) => process.stderr.write(d));
          stream.on('close', (code) => {
            conn.end();
            process.exit(code || 0);
          });
        });
        return;
      }
      const { local, remote } = uploads[i++];
      sftp.fastPut(local, remote, (e) => {
        if (e) throw e;
        console.log('Uploaded', remote);
        next();
      });
    };
    next();
  });
}).on('error', (e) => {
  console.error('SSH error:', e.message);
  process.exit(1);
}).connect({
  host: HOST,
  port: 22,
  username: USER,
  password,
  readyTimeout: 20000,
});
