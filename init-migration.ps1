[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$TargetPath,

    [Parameter(Mandatory)]
    [string]$ProjectName,

    [Parameter(Mandatory)]
    [string]$ProjectOwner,

    [string]$ProjectId,

    [switch]$AllowNonEmptyTarget,

    [switch]$ApproveSharedDemoCredential
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ($PSVersionTable.PSVersion.Major -lt 7) {
    throw 'PowerShell 7+ is required to initialize a migration project.'
}

function Assert-MetadataValue {
    param(
        [Parameter(Mandatory)]
        [string]$Name,

        [Parameter(Mandatory)]
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        throw "$Name must not be empty."
    }

    if ($Value.Length -gt 200 -or $Value -match '[\r\n]' -or $Value.Contains('{{')) {
        throw "$Name contains unsupported characters or exceeds 200 characters."
    }
}

function ConvertTo-ProjectId {
    param([Parameter(Mandatory)][string]$Value)

    $slug = $Value.ToLowerInvariant() -replace '[^a-z0-9._-]+', '-'
    $slug = $slug.Trim('-', '.', '_')
    if ([string]::IsNullOrWhiteSpace($slug)) {
        throw 'ProjectId could not be derived from ProjectName. Supply -ProjectId explicitly.'
    }

    return $slug
}

function ConvertTo-YamlScalarContent {
    param([Parameter(Mandatory)][string]$Value)

    return $Value.Replace("'", "''")
}

function Expand-ProjectTemplate {
    param(
        [Parameter(Mandatory)]
        [string]$Template,

        [Parameter(Mandatory)]
        [string]$Id,

        [Parameter(Mandatory)]
        [string]$Name,

        [Parameter(Mandatory)]
        [string]$Owner,

        [Parameter(Mandatory)]
        [string]$InitializedAt
    )

    return $Template.
        Replace('{{PROJECT_ID}}', (ConvertTo-YamlScalarContent $Id)).
        Replace('{{PROJECT_NAME}}', (ConvertTo-YamlScalarContent $Name)).
        Replace('{{PROJECT_OWNER}}', (ConvertTo-YamlScalarContent $Owner)).
        Replace('{{INITIALIZED_AT}}', $InitializedAt)
}

function Assert-UnlinkedTargetPath {
    param([Parameter(Mandatory)][string]$Path)

    $current = [IO.Path]::GetFullPath($Path)
    while (-not [string]::IsNullOrEmpty($current)) {
        $item = Get-Item -Force -LiteralPath $current -ErrorAction SilentlyContinue
        if ($null -ne $item -and ($item.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
            throw "Target paths must not traverse symbolic links or junctions: $current"
        }
        $current = Split-Path -Parent $current
    }
}

Assert-MetadataValue -Name 'ProjectName' -Value $ProjectName
Assert-MetadataValue -Name 'ProjectOwner' -Value $ProjectOwner

if ($PSBoundParameters.ContainsKey('ApproveSharedDemoCredential')) {
    throw '-ApproveSharedDemoCredential is obsolete and rejected. Initialization never imports credentials or approvals; omit this flag and configure the target environment separately.'
}

if ([string]::IsNullOrWhiteSpace($ProjectId)) {
    $ProjectId = ConvertTo-ProjectId -Value $ProjectName
}

Assert-MetadataValue -Name 'ProjectId' -Value $ProjectId
if ($ProjectId -notmatch '^[a-z0-9][a-z0-9._-]*$' -or $ProjectId.Length -gt 100) {
    throw 'ProjectId must match ^[a-z0-9][a-z0-9._-]*$ and be at most 100 characters.'
}

$sourceRoot = [IO.Path]::GetFullPath($PSScriptRoot)
# An initialized project contains decisions and evidence, not reusable blank inputs.
foreach ($projectControl in @('.migration-starter.json', 'config/project.yaml', 'analysis/migration_status.yaml')) {
    if (Test-Path -LiteralPath (Join-Path $sourceRoot $projectControl)) {
        throw 'Initialization requires the approved fresh Starter source, not an initialized project. No target files were written.'
    }
}
$resolvedTarget = [IO.Path]::GetFullPath($TargetPath)
if ($resolvedTarget.TrimEnd('\', '/') -eq $sourceRoot.TrimEnd('\', '/')) {
    throw 'TargetPath must not be the starter repository itself.'
}
$sourcePrefix = $sourceRoot.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
if ($resolvedTarget.StartsWith($sourcePrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'TargetPath must not be nested inside the starter repository.'
}
Assert-UnlinkedTargetPath $resolvedTarget

$targetExists = Test-Path -LiteralPath $resolvedTarget -PathType Container
if (Test-Path -LiteralPath $resolvedTarget -PathType Leaf) {
    throw "TargetPath points to a file: $resolvedTarget"
}

$targetIsNonEmpty = $false
if ($targetExists) {
    $targetIsNonEmpty = $null -ne (Get-ChildItem -Force -LiteralPath $resolvedTarget | Select-Object -First 1)
}

if ($targetIsNonEmpty -and -not $AllowNonEmptyTarget) {
    throw 'TargetPath is not empty. Re-run with -AllowNonEmptyTarget only after reviewing the target; existing files are never overwritten.'
}

$markerRelativePath = '.migration-starter.json'
$markerPath = Join-Path $resolvedTarget $markerRelativePath
$createdManifestPath = Join-Path $resolvedTarget '.migration-tmp/bootstrap-created-files.json'
$existingMarker = $null
if (Test-Path -LiteralPath $markerPath -PathType Leaf) {
    try {
        $existingMarker = Get-Content -Raw -LiteralPath $markerPath | ConvertFrom-Json
    }
    catch {
        throw "Existing initializer marker is invalid: $markerPath"
    }

    foreach ($property in @('schema_version', 'project_id', 'project_name', 'project_owner', 'initialized_at')) {
        if ($null -eq $existingMarker.PSObject.Properties[$property]) {
            throw "Existing initializer marker is missing '$property': $markerPath"
        }
    }

    if (
        $existingMarker.schema_version -ne '1.0.0' -or
        $existingMarker.project_id -cne $ProjectId -or
        $existingMarker.project_name -cne $ProjectName -or
        $existingMarker.project_owner -cne $ProjectOwner
    ) {
        throw 'Project metadata does not match the existing initializer marker. Refusing to rewrite initialized project identity.'
    }
}

$initializedAt = if ($null -ne $existingMarker) {
    [string]$existingMarker.initialized_at
}
else {
    [DateTimeOffset]::UtcNow.ToString('o')
}

$staticFiles = @(
    'analysis/tools/bootstrap-guidance.js',
    'analysis/tools/bootstrap-guidance.test.js',
    'analysis/architecture/review-cycles.md',
    'analysis/tools/constitution-boundaries.js',
    'analysis/tools/constitution-boundaries.test.js',
    'analysis/tools/constitution-version.js',
    'analysis/tools/constitution-version.test.js',
    'analysis/tools/artifact-reference-links.js',
    'analysis/tools/artifact-reference-links.test.js',
    'analysis/tools/architecture-review-records.test.js',
    'analysis/tools/architecture-review-history.js',
    'analysis/tools/architecture-review-history.test.js',
    'analysis/tools/excel-open-audit.ps1',
    'analysis/tools/process-boundary-audit.js',
    'analysis/tools/process-boundary-audit.test.js',
    'analysis/tools/parity-map-contract.js',
    'analysis/tools/parity-map-contract.test.js',
    'analysis/tools/xlsx-package.test.js',
    'analysis/tools/ui-parity-audit.js',
    'analysis/tools/ui-parity-audit.test.js',
    'analysis/artifact-responsibilities.md',
    'analysis/artifact-responsibilities.json',
    'analysis/tools/artifact-responsibility-audit.js',
    'analysis/tools/artifact-responsibility-audit.test.js',
    'analysis/artifact-naming.md',
    'analysis/artifact-naming.json',
    'analysis/tools/artifact-naming-audit.js',
    'analysis/tools/artifact-naming-audit.test.js',
    '.gitattributes',
    '.gitignore',
    'AGENTS.md',
    'CLAUDE.md',
    '.agents/skills/migration-pm/SKILL.md',
    '.agents/skills/migration-ba/SKILL.md',
    '.agents/skills/migration-ux/SKILL.md',
    '.agents/skills/migration-architect/SKILL.md',
    '.agents/skills/migration-developer/SKILL.md',
    '.agents/skills/migration-qa/SKILL.md',
    'ARTIFACTS.md',
    'MIGRATION.md',
    'README.md',
    'init-migration.ps1',
    '.github/workflows/starter-audit.yml',
    '.specify/README.md',
    '.specify/templates/plan-template.md',
    '.specify/templates/spec-template.md',
    '.specify/templates/tasks-template.md',
    'analysis/README.md',
    'analysis/artifact-relationship-graph.md',
    'analysis/agent_orchestration.md',
    'analysis/agent-roles.md',
    'analysis/agent-system-overview.md',
    'analysis/agent-system/build-view.js',
    'analysis/agent-system/diagram.svg',
    'analysis/agent-system/index.html',
    'analysis/agent-system/roles.html',
    'analysis/agent-system/en.html',
    'analysis/agent-system/example-view.js',
    'analysis/agent-system/example.svg',
    'analysis/agent-system/example.ru.svg',
    'analysis/tools/agent-system.test.js',
    'analysis/architecture/README.md',
    'analysis/architecture/architecture-legacy-discovery-instructions.md',
    'analysis/architecture/architecture-nfr-decision-register-instructions.md',
    'analysis/architecture/templates/NNN-SLUG-template.md',
    'analysis/architecture/templates/architecture-template.md',
    'analysis/architecture/templates/architecture-nfr-decision-register-template.xlsx',
    'analysis/architecture/templates/architecture-nfr-manifest.example.json',
    'analysis/architecture/templates/architecture-nfr-owner-review-template.md',
    'analysis/architecture/templates/architecture-review-verdict-template.md',
    'analysis/architecture/templates/architecture-owner-verdict-NNN-template.md',
    'analysis/architecture/templates/architecture-closure-NNN-template.md',
    'analysis/architecture/templates/sections/00-foundation-template.md',
    'analysis/architecture/templates/sections/NN-SLUG-template.md',
    'analysis/inventories/README.md',
    'analysis/inventories/target-surface-inventory.example.json',
    'analysis/knowledge/README.md',
    'analysis/knowledge/templates/SLUG-template.md',
    'analysis/knowledge/templates/index-template.md',
    'analysis/knowledge/templates/knowledge-manifest.example.json',
    'analysis/legacy_reconnaissance.template.md',
    'analysis/legacy_user_flows_template_instructions.md',
    'analysis/migration_artifact_flow.drawio',
    'analysis/migration_methodology.html',
    'analysis/migration_methodology.md',
    'analysis/migration_status.schema.json',
    'analysis/migration_status.template.yaml',
    'analysis/process-canvas/app.js',
    'analysis/process-canvas/build-data.js',
    'analysis/process-canvas/artifact-responsibilities.json',
    'analysis/process-canvas/sync-practical-guidance.js',
    'analysis/process-canvas/translations.ru.json',
    'analysis/process-canvas/translation-review.json',
    'analysis/process-canvas/data.json',
    'analysis/process-canvas/index.html',
    'analysis/process-canvas/README.md',
    'analysis/process-canvas/styles.css',
    'analysis/process-canvas/vendor/OrbitControls.js',
    'analysis/process-canvas/vendor/three.core.min.js',
    'analysis/process-canvas/vendor/three.module.min.js',
    'analysis/prototyping/README.md',
    'analysis/feature-dependencies-guide.md',
    'analysis/feature-dependencies.schema.json',
    'analysis/feature-dependencies.example.json',
    'analysis/tools/feature-dependencies.js',
    'analysis/tools/feature-dependencies.test.js',
    'analysis/feature-canvas/index.html',
    'analysis/feature-canvas/app.js',
    'analysis/feature-canvas/search.js',
    'analysis/tools/feature-search.test.js',
    'analysis/feature-canvas/styles.css',
    'analysis/feature-canvas/README.md',
    'analysis/feature-canvas/data.json',
    'analysis/feature-canvas/build-data.js',
    'analysis/feature-canvas/overview-layout.js',
    'analysis/feature-canvas/overview-geometry.js',
    'analysis/feature-canvas/work-order.js',
    'analysis/tools/work-order.test.js',
    'analysis/tools/overview-layout.test.js',
    'analysis/feature-canvas/vendor/three.module.min.js',
    'analysis/feature-canvas/vendor/three.core.min.js',
    'analysis/feature-canvas/vendor/OrbitControls.js',
    'analysis/feature-canvas/vendor/lucide.min.js',
    'analysis/feature-canvas/vendor/LUCIDE-LICENSE',
    'analysis/feature-canvas/vendor/THREE-LICENSE',
    'analysis/prototyping/ui-design-system-guide.md',
    'analysis/prototyping/templates/ui-design-system-template.md',
    'analysis/prototyping/templates/ui-design-tokens.example.json',
    'analysis/prototyping/ui-visual-parity-checklist.md',
    'analysis/prototyping/templates/ui-ux-approval-template.md',
    'analysis/prototyping/templates/ui-ux-decision-template.md',
    'analysis/prototyping/templates/ui-polish-backlog-template.md',
    'analysis/prototyping/templates/screen-manifest.example.json',
    'analysis/prototyping/templates/screen-normalization.example.json',
    'analysis/reviews/README.md',
    'analysis/reviews/stage-NN-pass-NNN-template.md',
    'analysis/stages/README.md',
    'analysis/stages/templates/bootstrap-gate-report-template.md',
    'analysis/stages/templates/GATE-SCOPE-template.md',
    'analysis/stages/templates/walkthrough-NNN-template.md',
    'analysis/stages/templates/stage-04-requirements-revision-template.md',
    'analysis/stages/templates/knowledge-record-template.md',
    'analysis/stages/templates/sdd-record-template.md',
    'analysis/stages/templates/delivery-NNN-template.md',
    'analysis/stages/templates/owner-walkthrough-NNN-template.md',
    'analysis/stages/templates/owner-walkthrough-decline-template.md',
    'analysis/stages/templates/stage-19-pass-NNN-template.md',
    'analysis/tools/.gitignore',
    'analysis/tools/README.md',
    'analysis/tools/architecture-audit.js',
    'analysis/tools/architecture-paths.js',
    'analysis/tools/architecture-review-records.js',
    'analysis/tools/architecture-audit.test.js',
    'analysis/tools/delivery-record-audit.js',
    'analysis/tools/live-reconciliation.js',
    'analysis/tools/live-reconciliation.test.js',
    'analysis/tools/rollback-readiness.js',
    'analysis/tools/rollback-readiness.test.js',
    'analysis/tools/delivery-record-audit.test.js',
    'analysis/tools/environment-config-audit.js',
    'analysis/tools/environment-config-audit.test.js',
    'analysis/tools/governance-hardening.test.js',
    'analysis/tools/helpers.js',
    'analysis/tools/knowledge-audit.js',
    'analysis/tools/knowledge-audit.test.js',
    'analysis/tools/lib.js',
    'analysis/tools/methodology-link-audit.js',
    'analysis/tools/methodology-link-audit.test.js',
    'analysis/tools/process-view-audit.js',
    'analysis/tools/process-view-audit.test.js',
    'analysis/tools/process-sync-regressions.test.js',
    'analysis/tools/process-contract.js',
    'analysis/tools/agent-role-contract.js',
    'analysis/tools/agent-role-contract.test.js',
    'analysis/tools/agent-role-view.js',
    'analysis/tools/agent-role-view.test.js',
    'analysis/tools/process-contract.test.js',
    'analysis/tools/process-consistency-audit.js',
    'analysis/tools/translation-audit.js',
    'analysis/process-contract.md',
    'analysis/error-prevention.md',
    'analysis/error-prevention-checklist.template.md',
    'analysis/tools/error-prevention-audit.js',
    'analysis/tools/error-prevention-audit.test.js',
    'analysis/process-cheatsheet.md',
    'analysis/tools/review-comparison-template.test.js',
    'analysis/tools/artifact-result-boundaries.test.js',
    'analysis/artifact-result-boundaries.md',
    'analysis/process-upgrade-1.5.md',
    'analysis/artifact-reading-contract.md',
    'analysis/artifact-reading-profiles.json',
    'analysis/artifact-status-meanings.md',
    'analysis/tools/artifact-reading.js',
    'analysis/tools/artifact-reading.test.js',
    'analysis/tools/artifact-status-readability.test.js',
    'analysis/stage-gates.json',
    'analysis/record-contracts.json',
    'analysis/gate-review-contracts.js',
    'analysis/gate-review-guide.md',
    'analysis/tools/sync-gate-review-guide.js',
    'analysis/tools/gate-review-contracts.test.js',
    'analysis/tools/sync-stage-gates.js',
    'analysis/tools/sync-presentation-structure.js',
    'analysis/tools/stage-gates.test.js',
    'analysis/tools/package-lock.json',
    'analysis/tools/package.json',
    'analysis/tools/prototype-audit.js',
    'analysis/tools/ui-design-system.js',
    'analysis/tools/ui-design-system.test.js',
    'analysis/tools/ui-design-system-fixtures.js',
    'analysis/tools/prototype-audit.test.js',
    'analysis/tools/project-config-audit.js',
    'analysis/tools/project-config-audit.test.js',
    'analysis/tools/remote-connect.js',
    'analysis/tools/remote-connect.test.js',
    'analysis/tools/sdd-completion-policy.js',
    'analysis/tools/sdd-completion-policy.test.js',
    'analysis/tools/sdd-audit.js',
    'analysis/tools/sdd-completion-scope.js',
    'analysis/tools/sdd-audit.test.js',
    'analysis/tools/traceability-index.js',
    'analysis/tools/traceability-index.test.js',
    'analysis/tools/status-validator.js',
    'analysis/tools/status-validator.test.js',
    'analysis/tools/target-surface-audit.js',
    'analysis/tools/target-surface-audit.test.js',
    'analysis/tools/verify-attestation-history.js',
    'analysis/tools/verify-attestation-history.test.js',
    'analysis/tools/verify-user-journey.js',
    'analysis/tools/verify-user-journey.test.js',
    'analysis/tools/workbook-audit.js',
    'analysis/tools/workbook-audit.test.js',
    'analysis/tools/workbook-progress.js',
    'analysis/tools/xlsx-package.js',
    'config/project.template.yaml',
    'config/project.schema.json',
    'config/environments.template.yaml',
    'config/environments.schema.json',
    'config/REMOTE_SERVER.md',
    'specs/README.md',
    'specs/traceability.template.md',
    'specs/traceability-guide.md',
    'specs/verification-record.template.md'
)

$utf8NoBom = [Text.UTF8Encoding]::new($false)
$writePlan = [Collections.Generic.List[object]]::new()
foreach ($relativePath in $staticFiles) {
    $sourcePath = Join-Path $sourceRoot $relativePath
    if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
        throw "Starter payload is incomplete; missing: $relativePath"
    }

    $writePlan.Add([pscustomobject]@{
        RelativePath = $relativePath
        Content = $null
        Bytes = [IO.File]::ReadAllBytes($sourcePath)
    })
}

$writePlan.Add([pscustomobject]@{
    RelativePath = 'config/environments.yaml'
    Content = [IO.File]::ReadAllText((Join-Path $sourceRoot 'config/environments.template.yaml'))
    Bytes = $null
})

$workbookTemplatePath = Join-Path $sourceRoot 'analysis/legacy_user_flows_template.xlsx'
if (-not (Test-Path -LiteralPath $workbookTemplatePath -PathType Leaf)) {
    throw 'Starter payload is incomplete; missing: analysis/legacy_user_flows_template.xlsx'
}

foreach ($relativePath in @(
    'analysis/legacy_user_flows_template.xlsx',
    'analysis/legacy_user_flows.xlsx'
)) {
    $writePlan.Add([pscustomobject]@{
        RelativePath = $relativePath
        Content = $null
        Bytes = [IO.File]::ReadAllBytes($workbookTemplatePath)
    })
}

$reconnaissanceTemplatePath = Join-Path $sourceRoot 'analysis/legacy_reconnaissance.template.md'
$writePlan.Add([pscustomobject]@{
    RelativePath = 'analysis/legacy_reconnaissance.md'
    Content = [IO.File]::ReadAllText($reconnaissanceTemplatePath)
    Bytes = $null
})

$writePlan.Add([pscustomobject]@{
    RelativePath = 'analysis/error-prevention-checklist.md'
    Content = [IO.File]::ReadAllText((Join-Path $sourceRoot 'analysis/error-prevention-checklist.template.md'))
    Bytes = $null
})

$statusTemplate = [IO.File]::ReadAllText(
    (Join-Path $sourceRoot 'analysis/migration_status.template.yaml')
)
$projectTemplate = [IO.File]::ReadAllText(
    (Join-Path $sourceRoot 'config/project.template.yaml')
)
$constitutionTemplate = [IO.File]::ReadAllText(
    (Join-Path $sourceRoot '.specify/memory/constitution.md')
)
$bootstrapGateReportTemplate = [IO.File]::ReadAllText(
    (Join-Path $sourceRoot 'analysis/stages/templates/bootstrap-gate-report-template.md')
)

$writePlan.Add([pscustomobject]@{
    RelativePath = 'analysis/migration_status.yaml'
    Content = Expand-ProjectTemplate $statusTemplate $ProjectId $ProjectName $ProjectOwner $initializedAt
    Bytes = $null
})
$writePlan.Add([pscustomobject]@{
    RelativePath = 'config/project.yaml'
    Content = Expand-ProjectTemplate $projectTemplate $ProjectId $ProjectName $ProjectOwner $initializedAt
    Bytes = $null
})
$writePlan.Add([pscustomobject]@{
    RelativePath = '.specify/memory/constitution.md'
    Content = $constitutionTemplate.
        Replace('{{PROJECT_NAME}}', $ProjectName).
        Replace('{{PROJECT_OWNER}}', $ProjectOwner)
    Bytes = $null
})
$writePlan.Add([pscustomobject]@{
    RelativePath = 'analysis/stages/bootstrap/bootstrap-gate-report.md'
    Content = Expand-ProjectTemplate $bootstrapGateReportTemplate $ProjectId $ProjectName $ProjectOwner $initializedAt
    Bytes = $null
})

foreach ($entry in $writePlan) {
    Assert-UnlinkedTargetPath (Join-Path $resolvedTarget $entry.RelativePath)
    if (
        $entry.RelativePath -in @(
            'analysis/migration_status.yaml',
            'analysis/stages/bootstrap/bootstrap-gate-report.md',
            'config/project.yaml',
            '.specify/memory/constitution.md'
        ) -and
        $null -ne $entry.Content -and
        $entry.Content -match '\{\{[A-Z0-9_]+\}\}'
    ) {
        throw "Unresolved template token in generated payload: $($entry.RelativePath)"
    }
}

if ($null -eq $existingMarker) {
    Assert-UnlinkedTargetPath $createdManifestPath
    if (Test-Path -LiteralPath $createdManifestPath) {
        throw 'Target already contains a bootstrap-created-files manifest without an initializer marker. Refusing to overwrite.'
    }
    $collisions = @(
        $writePlan |
            Where-Object { Test-Path -LiteralPath (Join-Path $resolvedTarget $_.RelativePath) } |
            ForEach-Object { $_.RelativePath }
    )
    if ($collisions.Count -gt 0) {
        throw "Target contains initializer-owned paths and has no matching marker. Refusing to overwrite: $($collisions -join ', ')"
    }
}

# Resolve runtime and target-local dependency needs before creating any payload.
$node = Get-Command node -ErrorAction SilentlyContinue
if ($null -eq $node) {
    throw 'Node.js 22 is required to validate the generated migration control files.'
}
$nodeMajor = & $node.Source -p "process.versions.node.split('.')[0]"
if ($LASTEXITCODE -ne 0 -or $nodeMajor -ne '22') {
    throw "Node.js 22 is required; detected major version '$nodeMajor'."
}

$auditToolsRoot = Join-Path $resolvedTarget 'analysis/tools'
Assert-UnlinkedTargetPath (Join-Path $auditToolsRoot 'node_modules')
Assert-UnlinkedTargetPath (Join-Path $resolvedTarget '.migration-tmp/npm-cache')
$packagePath = Join-Path $auditToolsRoot 'package.json'
if (-not (Test-Path -LiteralPath $packagePath -PathType Leaf)) {
    $packagePath = Join-Path $sourceRoot 'analysis/tools/package.json'
}
$package = Get-Content -Raw -LiteralPath $packagePath | ConvertFrom-Json
$missingDependencies = @(
    $package.dependencies.PSObject.Properties.Name | Where-Object {
        Assert-UnlinkedTargetPath (Join-Path $auditToolsRoot "node_modules/$_/package.json")
        -not (Test-Path -LiteralPath (Join-Path $auditToolsRoot "node_modules/$_/package.json") -PathType Leaf)
    }
)
$npm = $null
if ($missingDependencies.Count -gt 0) {
    $npmCommand = if ($IsWindows) { 'npm.cmd' } else { 'npm' }
    $npm = Get-Command $npmCommand -ErrorAction SilentlyContinue
    if ($null -eq $npm) {
        throw 'npm is required to install deterministic validation dependencies in the target.'
    }
    & $npm.Source --version
    if ($LASTEXITCODE -ne 0) {
        throw "npm runtime preflight failed (exit code $LASTEXITCODE)."
    }
}

if (-not $targetExists) {
    [void](New-Item -ItemType Directory -Path $resolvedTarget)
}

$created = [Collections.Generic.List[string]]::new()
$preserved = [Collections.Generic.List[string]]::new()
foreach ($entry in $writePlan) {
    $destinationPath = Join-Path $resolvedTarget $entry.RelativePath
    if (Test-Path -LiteralPath $destinationPath) {
        $preserved.Add($entry.RelativePath)
        continue
    }

    $destinationDirectory = Split-Path -Parent $destinationPath
    if (-not (Test-Path -LiteralPath $destinationDirectory -PathType Container)) {
        [void](New-Item -ItemType Directory -Path $destinationDirectory)
    }

    if ($null -ne $entry.Bytes) {
        [IO.File]::WriteAllBytes($destinationPath, $entry.Bytes)
    }
    else {
        [IO.File]::WriteAllText($destinationPath, $entry.Content, $utf8NoBom)
    }
    $created.Add($entry.RelativePath)
}

if ($null -eq $existingMarker) {
    $marker = [ordered]@{
        schema_version = '1.0.0'
        project_id = $ProjectId
        project_name = $ProjectName
        project_owner = $ProjectOwner
        initialized_at = $initializedAt
    }
    [IO.File]::WriteAllText(
        $markerPath,
        (($marker | ConvertTo-Json) + [Environment]::NewLine),
        $utf8NoBom
    )
    $created.Add($markerRelativePath)
}
else {
    $preserved.Add($markerRelativePath)
}

$statusValidator = Join-Path $auditToolsRoot 'status-validator.js'
$projectValidator = Join-Path $auditToolsRoot 'project-config-audit.js'
$statusFile = Join-Path $resolvedTarget 'analysis/migration_status.yaml'
$statusSchema = Join-Path $resolvedTarget 'analysis/migration_status.schema.json'

Push-Location -LiteralPath $resolvedTarget
try {
    $previousAuditTestMode = $env:AUDIT_TEST_MODE
    $env:AUDIT_TEST_MODE = '1'
    if ($missingDependencies.Count -gt 0) {
        $npmCache = Join-Path $resolvedTarget '.migration-tmp/npm-cache'
        & $npm.Source --prefix $auditToolsRoot ci --ignore-scripts --cache $npmCache --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) {
            throw "Target validation dependencies failed to install (exit code $LASTEXITCODE)."
        }
    }
    if ($null -eq $existingMarker) {
        $manifestDirectory = Split-Path -Parent $createdManifestPath
        if (-not (Test-Path -LiteralPath $manifestDirectory -PathType Container)) {
            [void](New-Item -ItemType Directory -Path $manifestDirectory)
        }
        [IO.File]::WriteAllText(
            $createdManifestPath,
            ((ConvertTo-Json -InputObject $created.ToArray()) + [Environment]::NewLine),
            $utf8NoBom
        )
        & $node.Source 'analysis/tools/bootstrap-guidance.js' $createdManifestPath
        if ($LASTEXITCODE -ne 0) {
            throw "New-project Bootstrap guidance failed to initialize (exit code $LASTEXITCODE). Existing files were not authorized for normalization."
        }
    }
    & $node.Source $statusValidator "--file=$statusFile" "--schema=$statusSchema"
    if ($LASTEXITCODE -ne 0) {
        throw "Generated migration status failed validation (exit code $LASTEXITCODE)."
    }

    & $node.Source $projectValidator "--root=$resolvedTarget"
    if ($LASTEXITCODE -ne 0) {
        throw "Generated project configuration failed validation (exit code $LASTEXITCODE)."
    }
}
finally {
    $env:AUDIT_TEST_MODE = $previousAuditTestMode
    Pop-Location
}

Write-Host "Migration bootstrap initialized at: $resolvedTarget"
Write-Host "Project: $ProjectName ($ProjectId)"
Write-Host "Created: $($created.Count); preserved: $($preserved.Count)"
Write-Host 'Generated migration status and project configuration validated successfully.'
Write-Host 'Existing files were preserved. Full Bootstrap audits may flag them; record blockers and request scoped correction authority, never blanket normalization.'
Write-Host 'State remains bootstrap. No constitution ratification or stage transition was recorded.'
