#!/usr/bin/env python3
import os
import json
from ftplib import FTP

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_FILE = os.path.join(ROOT, 'ftp-simple.json')
EXCLUDE = {'.git', '.gitignore', 'node_modules', '.DS_Store', 'ftp-simple.json', 'scripts', 'info.html'}


def load_config():
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)


def upload_files(ftp, local_dir, remote_dir, base_local_dir):
    """Recursively upload files, skipping excluded items."""
    try:
        ftp.cwd(remote_dir)
    except Exception as e:
        print(f'Could not change to {remote_dir}: {e}')
        return

    for item in os.listdir(local_dir):
        if item in EXCLUDE:
            continue
        
        local_path = os.path.join(local_dir, item)
        
        if os.path.isdir(local_path):
            # Create remote dir and recurse
            try:
                ftp.mkd(item)
            except Exception:
                pass  # Dir may already exist
            try:
                ftp.cwd(item)
                upload_files(ftp, local_path, item, base_local_dir)
                ftp.cwd('..')
            except Exception as e:
                print(f'Skipping directory {item}: {e}')
        else:
            # Upload file
            try:
                with open(local_path, 'rb') as f:
                    print(f'Uploading {item}...')
                    ftp.storbinary(f'STOR {item}', f, 1024)
                    print(f'  ✓ {item}')
            except Exception as e:
                print(f'  ✗ Failed: {e}')


def main():
    cfg = load_config()
    host = cfg.get('host')
    username = cfg.get('username')
    password = cfg.get('password')
    remotepath = cfg.get('remotepath', '/')
    
    if not host or not username or not password:
        print('Missing FTP credentials in', CONFIG_FILE)
        return

    try:
        ftp = FTP(host, timeout=60)
        print(f'Connecting to {host}...')
        ftp.login(username, password)
        print('✓ Connected')
        print(f'Uploading to {remotepath}')
        upload_files(ftp, ROOT, remotepath, ROOT)
        ftp.quit()
        print('✓ Upload complete')
    except Exception as e:
        print(f'✗ Error: {e}')
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
