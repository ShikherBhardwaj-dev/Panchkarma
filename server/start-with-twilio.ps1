<#
Interactive PowerShell script to set Twilio env vars for the current session and start the server.

Usage:
  Open PowerShell, cd to the repo root or this script folder, then run:
    .\start-with-twilio.ps1

This script will prompt for TWILIO_SID, TWILIO_TOKEN, TWILIO_WHATSAPP_FROM and optional TWILIO_STATUS_CALLBACK_URL,
set them as environment variables for the session, and then start the server (node server.js).

It does NOT persist secrets to disk. Run in the same shell where you want the server to run.
#>

Write-Host "Starting Panchkarma server with Twilio environment variables"

$twilioSid = Read-Host "Enter TWILIO_SID (Account SID)"
if (-not $twilioSid) { Write-Host "TWILIO_SID is required"; exit 1 }

$twilioToken = Read-Host "Enter TWILIO_TOKEN (Auth Token)"
if (-not $twilioToken) { Write-Host "TWILIO_TOKEN is required"; exit 1 }

$twilioWhatsappFrom = Read-Host "Enter TWILIO_WHATSAPP_FROM (e.g. whatsapp:+14155238886 or +14155238886)"
if (-not $twilioWhatsappFrom) { Write-Host "TWILIO_WHATSAPP_FROM is required"; exit 1 }

$twilioCallback = Read-Host "Enter TWILIO_STATUS_CALLBACK_URL (optional, e.g. https://<ngrok-id>.ngrok.io/admin/twilio-status)"

# Set environment variables for current session
$env:TWILIO_SID = $twilioSid
$env:TWILIO_TOKEN = $twilioToken
$env:TWILIO_WHATSAPP_FROM = $twilioWhatsappFrom
if ($twilioCallback) { $env:TWILIO_STATUS_CALLBACK_URL = $twilioCallback }

Write-Host "Environment variables set. Starting server..."

# Start server (assumes this script is inside server/ or run from repo root)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptDir
try {
  node server.js
} finally {
  Pop-Location
}
