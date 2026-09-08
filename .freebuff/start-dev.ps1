Set-Location "C:\Users\ACER\lumina"
$nodePath = (Get-Command node).Source
$nextBin = "C:\Users\ACER\lumina\node_modules\next\dist\bin\next"
Start-Process -FilePath $nodePath -ArgumentList $nextBin,"dev" -RedirectStandardOutput "C:\Users\ACER\lumina\.freebuff\preview-920dd28b-e074-4dae-a832-08a341e0d153.log" -RedirectStandardError "C:\Users\ACER\lumina\.freebuff\preview-920dd28b-e074-4dae-a832-08a341e0d153.log.err" -WindowStyle Hidden -PassThru | Select-Object -ExpandProperty Id
