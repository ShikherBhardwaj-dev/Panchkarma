<#
Simple PowerShell script to POST to /admin/send-test-whatsapp
Usage: run from server folder or pass full URL in prompt
#>
$url = Read-Host "Enter server URL (default http://localhost:5000)"
if (-not $url) { $url = 'http://localhost:5000' }

$email = Read-Host "Enter recipient email (user must exist in DB)"
if (-not $email) { Write-Host "Email required"; exit 1 }

$message = Read-Host "Enter message (or press Enter for default)"
if (-not $message) { $message = 'Test reminder: your session is scheduled' }

$body = @{ email = $email; message = $message } | ConvertTo-Json

try {
  $res = Invoke-RestMethod -Uri "$url/admin/send-test-whatsapp" -Method POST -Body $body -ContentType 'application/json'
  Write-Host "Response:`n" (ConvertTo-Json $res -Depth 5)
} catch {
  Write-Host "Request failed:`n" $_.Exception.Response.Content.ReadAsStringAsync().Result
}
