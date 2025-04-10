Write-Host "Testing Supabase MCP Server..."
npx -y @supabase/mcp-server-supabase@latest --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "MCP Server test successful!"
} else {
    Write-Host "MCP Server test failed!"
} 