#!/usr/bin/env python3
import os
import json
import time
from ftplib import FTP, all_errors

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_FILE = os.path.join(ROOT, 'ftp-simple.json')
EXCLUDE = {'.git', '.gitignore', 'node_modules', '.DS_Store', 'ftp-simple.json', 'scripts', 'info.html', 'COMPILATION_REPORT.md'}
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds


def load_config():
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)


def reconnect_ftp(host, port, username, password):
    """Create a fresh FTP connection."""
    try:
        ftp = FTP()
        ftp.set_debuglevel(0)
        ftp.connect(host, port, timeout=120)
        ftp.login(username, password)
        ftp.set_pasv(False)  # Active mode
        return ftp
    except Exception as e:
        print(f'  ✗ Reconnect failed: {e}')
        return None


def ensure_remote_dir(ftp, path):
    """Ensure remote directory exists."""
    if not path or path == '/':
        try:
            ftp.cwd('/')
        except:
            pass
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


def upload_file_with_retry(ftp, local_path, filename, host, port, username, password):
    """Upload a single file with retry logic."""
    for attempt in range(MAX_RETRIES):
        try:
            size = os.path.getsize(local_path)
            print(f'  Uploading {filename} ({size} bytes) [attempt {attempt+1}/{MAX_RETRIES}]')
            
            with open(local_path, 'rb') as f:
                ftp.storbinary(f'STOR {filename}', f, 8192)
            
            print(f'    ✓ {filename}')
            return True
        except Exception as e:
            print(f'    ✗ Attempt {attempt+1} failed: {e}')
            if attempt < MAX_RETRIES - 1:
                wait = RETRY_DELAY * (2 ** attempt)  # Exponential backoff
                print(f'    Retrying in {wait}s...')
                time.sleep(wait)
                # Reconnect before retry
                try:
                    ftp.quit()
                except:
                    pass
                ftp = reconnect_ftp(host, port, username, password)
                if not ftp:
                    continue
            else:
                print(f'    ✗ Failed after {MAX_RETRIES} attempts')
                return False
    return False


def upload_dir(ftp, local_dir, host, port, username, password):
    """Recursively upload directory structure."""
    items = sorted(os.listdir(local_dir))
    
    for item in items:
        if item.startswith('.') and item not in {'.gitignore'}:
            continue
        if item in EXCLUDE:
            continue
        
        local_path = os.path.join(local_dir, item)
        
        if os.path.isdir(local_path):
            print(f'Directory: {item}/')
            try:
                ftp.mkd(item)
            except:
                pass
            try:
                ftp.cwd(item)
                upload_dir(ftp, local_path, host, port, username, password)
                ftp.cwd('..')
            except Exception as e:
                print(f'  ✗ Error in {item}: {e}')
        else:
            upload_file_with_retry(ftp, local_path, item, host, port, username, password)


def main():
    cfg = load_config()
    host = cfg.get('host')
    username = cfg.get('username')
    password = cfg.get('password')
    remotepath = cfg.get('remotepath', '/')
    port = cfg.get('port', 21)
    
    if not host or not username or not password:
        print('✗ Missing FTP credentials')
        return

    try:
        print(f'Connecting to {host}:{port}...')
        ftp = reconnect_ftp(host, port, username, password)
        if not ftp:
            raise Exception('Failed to connect')
        print('✓ Connected (active mode, longer timeouts, retry enabled)')
        
        print(f'Navigating to {remotepath}')
        ensure_remote_dir(ftp, remotepath)
        
        print('\n--- Starting upload ---\n')
        upload_dir(ftp, ROOT, host, port, username, password)
        
        try:
            ftp.quit()
        except:
            pass
        print('\n✓ Upload complete!')
    except Exception as e:
        print(f'\n✗ Fatal error: {e}')
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
