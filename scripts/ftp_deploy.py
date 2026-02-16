#!/usr/bin/env python3
import os
import json
from ftplib import FTP

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_FILE = os.path.join(ROOT, 'ftp-simple.json')
EXCLUDE = {'.git', '.gitignore', 'node_modules', '.DS_Store', 'ftp-simple.json', 'scripts', 'info.html', '.DS_Store', 'COMPILATION_REPORT.md'}


def load_config():
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)


def ensure_remote_dir(ftp, path):
    """Ensure remote directory exists, creating if needed."""
    if not path or path == '/':
        return
    parts = [p for p in path.split('/') if p]
    for part in parts:
        try:
            ftp.cwd(part)
        except:
            try:
                ftp.mkd(part)
                ftp.cwd(part)
            except Exception as e:
                print(f'  ✗ Could not create dir {part}: {e}')
                raise


def upload_dir(ftp, local_dir, remote_base):
    """Recursively upload directory structure."""
    for item in os.listdir(local_dir):
        if item.startswith('.') and item not in {'.gitignore'}:
            continue
        if item in EXCLUDE:
            print(f'Skipping: {item}')
            continue
        
        local_path = os.path.join(local_dir, item)
        
        if os.path.isdir(local_path):
            print(f'Creating dir: {item}/')
            try:
                ftp.mkd(item)
            except:
                pass  # May already exist
            try:
                ftp.cwd(item)
                upload_dir(ftp, local_path, remote_base)
                ftp.cwd('..')
            except Exception as e:
                print(f'  ✗ Error in dir {item}: {e}')
        else:
            # Upload file
            try:
                with open(local_path, 'rb') as f:
                    size = os.path.getsize(local_path)
                    print(f'Uploading: {item} ({size} bytes)...')
                    ftp.storbinary(f'STOR {item}', f, 8192)
                    print(f'  ✓ {item}')
            except Exception as e:
                print(f'  ✗ Failed: {item} - {e}')


def main():
    cfg = load_config()
    host = cfg.get('host')
    username = cfg.get('username')
    password = cfg.get('password')
    remotepath = cfg.get('remotepath', '/')
    port = cfg.get('port', 21)
    
    if not host or not username or not password:
        print('Missing FTP credentials')
        return

    try:
        print(f'Connecting to {host}:{port}...')
        ftp = FTP()
        ftp.set_debuglevel(0)  # Suppress debug output
        ftp.connect(host, port, timeout=60)
        ftp.login(username, password)
        print('✓ Connected and logged in')
        
        # Use active mode to avoid EPSV issues
        ftp.set_pasv(False)
        print('Using active mode (no EPSV)')
        
        print(f'Navigating to {remotepath}')
        ensure_remote_dir(ftp, remotepath)
        
        print('\nUploading files...')
        upload_dir(ftp, ROOT, remotepath)
        
        ftp.quit()
        print('\n✓ Upload complete!')
    except Exception as e:
        print(f'\n✗ Error: {e}')
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
