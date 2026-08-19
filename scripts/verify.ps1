$ErrorActionPreference = "Stop"
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")

$fnm = Get-Command fnm -ErrorAction Stop
(& $fnm.Source env --shell powershell | Out-String) | Invoke-Expression

Write-Host "Node $(node --version)"
Write-Host "npm $(npm.cmd --version)"
npm.cmd install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm.cmd run typecheck
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm.cmd run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm.cmd run build
exit $LASTEXITCODE
