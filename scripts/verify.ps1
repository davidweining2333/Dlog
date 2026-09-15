$ErrorActionPreference = "Stop"
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")

$fnm = Get-Command fnm -ErrorAction Stop
(& $fnm.Source env --shell powershell | Out-String) | Invoke-Expression

Write-Host "Node $(node --version)"
Write-Host "pnpm $(pnpm --version)"
pnpm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
pnpm run typecheck
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
pnpm run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
pnpm run build
exit $LASTEXITCODE
