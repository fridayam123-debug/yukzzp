@echo off
rem 네이버 리뷰 동기화 — Windows 작업 스케줄러용
cd /d "C:\Users\pc\Desktop\j project"
call npx tsx scripts/sync-naver-reviews.ts >> scripts\sync-log.txt 2>&1
