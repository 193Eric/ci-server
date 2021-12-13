#!/bin/bash
export PATH=/usr/lib64/qt-3.3/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/opt/soft/node-v4.4.4-linux-x64/bin:/root/bin:/Users/boutell/npm/bin
# modulesPath=$5/temp/mods/$3/
projectPath=$1
task=$2

#更新依赖库

cd ../../../
pwd

cd $projectPath
pwd
if [ "$4" -eq "2" ]; then
cnpm install --save
fi
echo 'npm installed'

echo '开始构建'

$2
