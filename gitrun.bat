@echo off
cd /d C:\Users\camer\lawn-care-tools
C:\PROGRA~1\Git\bin\git.exe %* > C:\Users\camer\lawn-care-tools\gitout.txt 2>&1
type C:\Users\camer\lawn-care-tools\gitout.txt
