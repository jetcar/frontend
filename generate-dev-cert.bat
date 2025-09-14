@echo off
REM Batch script to generate self-signed certificate for React dev server
set CERT_PATH=certs\dev-cert.crt
set KEY_PATH=certs\dev-cert.key
set CSR_PATH=certs\dev-cert.csr

REM Generate private key
openssl genrsa -out %KEY_PATH% 2048
REM Generate certificate signing request
openssl req -new -key %KEY_PATH% -out %CSR_PATH% -subj "/CN=localhost"
REM Generate self-signed certificate
openssl x509 -req -days 365 -in %CSR_PATH% -signkey %KEY_PATH% -out %CERT_PATH%
del %CSR_PATH%

echo Certificate and key generated at %CERT_PATH% and %KEY_PATH%
