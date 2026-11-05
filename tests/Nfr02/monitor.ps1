param(
    [Parameter(Mandatory = $true)][int]$ApiPid,
    [Parameter(Mandatory = $true)][string]$OutputCsv,
    [int]$DurationSeconds = 3600,
    [int]$SampleSeconds = 5
)

$deadline = [DateTimeOffset]::UtcNow.AddSeconds($DurationSeconds)
$parent = Split-Path -Parent $OutputCsv
New-Item -ItemType Directory -Force -Path $parent | Out-Null
if (Test-Path -LiteralPath $OutputCsv) { Remove-Item -LiteralPath $OutputCsv -Force }
$sample = 0

while ([DateTimeOffset]::UtcNow -lt $deadline) {
    $api = Get-Process -Id $ApiPid -ErrorAction Stop
    $os = Get-CimInstance Win32_OperatingSystem
    $cpu = Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'"
    $pg = (& docker --context desktop-linux stats --no-stream --format '{{.MemUsage}}|{{.CPUPerc}}' issue43-nfr02-postgres 2>$null) -join ''
    $row = [pscustomobject]@{
        TimestampUtc = [DateTimeOffset]::UtcNow.ToString('o')
        ApiWorkingSetMiB = [math]::Round($api.WorkingSet64 / 1MB, 2)
        ApiPrivateMiB = [math]::Round($api.PrivateMemorySize64 / 1MB, 2)
        ApiCpuSeconds = [math]::Round($api.CPU, 2)
        HostCpuPercent = [int]$cpu.PercentProcessorTime
        HostAvailableMiB = [math]::Round($os.FreePhysicalMemory / 1024, 2)
        HostTotalMiB = [math]::Round($os.TotalVisibleMemorySize / 1024, 2)
        PostgresContainerStats = $pg
    }
    if ($sample -eq 0) { $row | Export-Csv -LiteralPath $OutputCsv -NoTypeInformation }
    else { $row | Export-Csv -LiteralPath $OutputCsv -NoTypeInformation -Append }
    $sample++
    if ($sample % 12 -eq 0) { Write-Output "sampled $sample points at $($row.TimestampUtc)" }
    Start-Sleep -Seconds $SampleSeconds
}
Write-Output "saved $sample resource samples to $OutputCsv"
