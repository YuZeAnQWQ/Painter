$npm_version = &{npm -v} 2>&1
if($npm_version -is [System.Management.Automation.ErrorRecord]) {
    start 'https://nodejs.org/'
} else {
    Write-Host ('npm ' + $npm_version)
    $python_version = &{py -V} 2>&1
    if($python_version -is [System.Management.Automation.ErrorRecord]) {
        start 'https://www.python.org/downloads/'
    } else {
        Write-Host $python_version
        $pip_version = &{pip -V} 2>&1
        if($pip_version -is [System.Management.Automation.ErrorRecord]) {
            py -m ensurepip --upgrade
        }
        Write-Host $pip_version
        $pillow_version = &{pip show pillow} 2>&1
        if($pillow_version -is [System.Management.Automation.ErrorRecord]) {
            pip install pillow
        }
        Write-Host ('Pillow ' + $pillow_version[1])
        Write-Host ""
        $pic_filename = (Get-Content -Raw config.json | ConvertFrom-Json).pictures.id
        $piclen = $pic_filename.length
        $pic_name_list = (ls pic).Name
        for($i = 0;$i -lt $piclen;$i = $i + 1) {
            if($piclen -eq 1) {
                $pic_name = $($pic_name_list)
            } else {
                $pic_name = $($pic_name_list[$i])
            }
            Write-Host ($pic_name)
            py tools/pic2json.py $pic_name
        }
        Write-Host ""
        npm install
    }
}