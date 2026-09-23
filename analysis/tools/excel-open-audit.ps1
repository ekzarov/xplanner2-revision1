param(
    [string]$Workbook = (Join-Path $PSScriptRoot '..\legacy_user_flows.xlsx')
)

$ErrorActionPreference = 'Stop'
$path = (Resolve-Path -LiteralPath $Workbook).Path
$excel = $null
$book = $null

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    $book = $excel.Workbooks.Open($path, 0, $true)
    Write-Host "EXCEL DESKTOP OPEN AUDIT OK: $path"
}
catch {
    throw "Excel Desktop could not open '$path' without recovery: $($_.Exception.Message)"
}
finally {
    if ($book) { $book.Close($false) }
    if ($excel) { $excel.Quit() }
}
