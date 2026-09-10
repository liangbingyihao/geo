#!/usr/bin/env python3
import os
import json
import hashlib
import shutil

CACHE_FILE = '.asset-cache.json'
RAW_DIR = 'RawAsset'
ASSETS_DIR = 'assets'
BANNER_DIR = os.path.join(ASSETS_DIR, 'banners')
CHAR_DIR = os.path.join(ASSETS_DIR, 'characters')

character_map = {
    '摩西.png': 'moses.png',
    '以利亞.png': 'elijah.png',
    '彼得.png': 'peter.png',
    '保羅.png': 'paul.png',
    '約書亞.png': 'joshua.png',
    '約伯.png': 'job.png',
    '以諾.png': 'enoch.png',
    '阿摩司.png': 'amos.png',
    '沙倫.png': 'shalom.png',
    '亞比該.png': 'abigail.png',
    '亞撒利雅.png': 'azariah.png',
    '伊莉莎白.png': 'elizabeth.png',
    '戶勒大.png': 'huldah.png',
    '施洗約翰.png': 'john-baptist.png',
    '撒馬利亞婦人.png': 'samaritan-woman.png',
    '多馬.png': 'thomas.png',
}

banner_map = {
    '1-简体.png': 'banner-zh-CN-1.png',
    '2-简体.png': 'banner-zh-CN-2.png',
    '3-简体.png': 'banner-zh-CN-3.png',
    '1-繁体.png': 'banner-zh-TW-1.png',
    '2-繁体.png': 'banner-zh-TW-2.png',
    '3-繁体.png': 'banner-zh-TW-3.png',
    '1-英文.png': 'banner-en-1.png',
    '2-英文.png': 'banner-en-2.png',
    '3-英文.png': 'banner-en-3.png',
}

asset_direct_map = {
    '0-logo.webp': 'logo.webp',
    '1-bg.webp': 'hero-bg.webp',
    '1-apple.webp': 'app-store.webp',
    '1-android.webp': 'google-play.webp',
    '2-next.webp': 'next.webp',
    '2-prev.webp': 'prev.webp',
    '3-1.webp': 'feature-1.webp',
    '3-2.webp': 'feature-2.webp',
    '3-3.webp': 'feature-3.webp',
    '3-4.webp': 'feature-4.webp',
    '3-article.webp': 'icon-article.webp',
    '3-music.webp': 'icon-music.webp',
    '3-pen.webp': 'icon-pen.webp',
    '3-stars.webp': 'icon-stars.webp',
    '4-1.webp': 'testimonial-1.webp',
    '4-2.webp': 'testimonial-2.webp',
    '4-3.webp': 'testimonial-3.webp',
    '7-bg.webp': 'contact-bg.webp',
    '7-facebook.webp': 'icon-facebook.webp',
    '7-instagram.webp': 'icon-instagram.webp',
    '7-yutube.webp': 'icon-youtube.webp',
}


def file_hash(filepath):
    try:
        stat = os.stat(filepath)
        return f"{stat.st_size}-{int(stat.st_mtime_ns)}"
    except OSError:
        return None


def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return {}


def save_cache(cache):
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f, indent=2)


def copy_if_changed(src, dst, cache, cache_key):
    h = file_hash(src)
    if h is None:
        print(f"  [SKIP] Source not found: {src}")
        return False
    if cache.get(cache_key) == h:
        return False
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    cache[cache_key] = h
    print(f"  [COPY] {os.path.basename(src)} -> {os.path.basename(dst)}")
    return True


def main():
    print("=== Processing Assets ===")
    cache = load_cache()
    changed = False

    for src_name, dst_name in asset_direct_map.items():
        src = os.path.join(RAW_DIR, src_name)
        dst = os.path.join(ASSETS_DIR, dst_name)
        if copy_if_changed(src, dst, cache, src_name):
            changed = True

    os.makedirs(BANNER_DIR, exist_ok=True)
    banner_src = os.path.join(RAW_DIR, '2-banner')
    if os.path.isdir(banner_src):
        for fname in sorted(os.listdir(banner_src)):
            if fname == '.DS_Store':
                continue
            dst_name = banner_map.get(fname)
            if dst_name:
                src = os.path.join(banner_src, fname)
                dst = os.path.join(BANNER_DIR, dst_name)
                ck = f"2-banner/{fname}"
                if copy_if_changed(src, dst, cache, ck):
                    changed = True
            else:
                print(f"  [WARN] No mapping for banner: {fname}")

    os.makedirs(CHAR_DIR, exist_ok=True)
    char_src = os.path.join(RAW_DIR, '5-人物')
    if os.path.isdir(char_src):
        for fname in sorted(os.listdir(char_src)):
            if fname == '.DS_Store':
                continue
            dst_name = character_map.get(fname)
            if dst_name:
                src = os.path.join(char_src, fname)
                dst = os.path.join(CHAR_DIR, dst_name)
                ck = f"5-人物/{fname}"
                if copy_if_changed(src, dst, cache, ck):
                    changed = True
            else:
                print(f"  [WARN] No mapping for character: {fname}")

    save_cache(cache)
    status = "files updated" if changed else "up to date"
    print(f"\n=== Done ({status}) ===")


if __name__ == '__main__':
    main()
