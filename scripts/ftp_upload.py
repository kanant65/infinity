#!/usr/bin/env python3
import os
import json
from ftplib import FTP, error_perm

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_FILE = os.path.join(ROOT, 'ftp-simple.json')
EXCLUDE = {'.git', '.gitignore', 'node_modules', '.DS_Store', 'ftp-simple.json', 'scripts/ftp_upload.py', 'info.html'}


def load_config():
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)


def ensure_remote_dir(ftp, path):
    # change to root
    if path == '/' or path == '':
        try:
            ftp.cwd('/')
        except Exception:
            pass
        return
    parts = [p for p in path.split('/') if p]
    for p in parts:
        try:
            ftp.cwd(p)
        except error_perm:
            try:
                ftp.mkd(p)
                ftp.cwd(p)
            except Exception as e:
                print('Failed to create remote directory', p, e)
                raise


def upload_dir(ftp, local_dir, remote_dir):
    # ensure remote_dir exists and cwd into it
    ensure_remote_dir(ftp, remote_dir)
    for root, dirs, files in os.walk(local_dir):
        # compute relative path from local_dir
        rel_root = os.path.relpath(root, local_dir)
        if rel_root == '.':
            rel_root = ''
        # create/cd to remote subdir
        if rel_root:
            try:
                ftp.cwd('/')
                ensure_remote_dir(ftp, os.path.join(remote_dir, rel_root).replace('\\', '/'))
            except Exception as e:
                print('Could not ensure remote subdir', rel_root, e)
                continue
        # upload files
        for fname in files:
            if fname in EXCLUDE:
                continue
            local_path = os.path.join(root, fname)
            rel_path = os.path.join(rel_root, fname).replace('\\', '/')
            remote_path = os.path.join(remote_dir, rel_path).replace('\\', '/')
            # ensure remote folder
            remote_folder = os.path.dirname(remote_path)
            try:
                ftp.cwd('/')
                ensure_remote_dir(ftp, remote_folder)
            except Exception:
                pass
            print('Uploading', local_path, '->', remote_path)
            with open(local_path, 'rb') as f:
                try:
                    ftp.storbinary('STOR ' + os.path.basename(remote_path), f)
                except Exception as e:
                    print('Failed uploading', local_path, e)


def main():
    cfg = load_config()
    host = cfg.get('host')
    username = cfg.get('username')
    password = cfg.get('password')
    remotepath = cfg.get('remotepath', '/')
    if not host or not username or not password:
        print('Missing FTP credentials in', CONFIG_FILE)
        return

    ftp = FTP(host, timeout=30)
    ftp.set_pasv(True)
    # Disable EPSV to avoid "229 Extended Passive Mode" errors
    ftp.set_pasv(False)
    ftp.set_pasv(True)
    print('Connecting to', host)
    ftp.login(username, password)
    print('Connected. Uploading to remote path:', remotepath)

    # start upload from ROOT (project root)
    upload_dir(ftp, ROOT, remotepath)

    ftp.quit()
    print('Upload complete')

if __name__ == '__main__':
    main()
