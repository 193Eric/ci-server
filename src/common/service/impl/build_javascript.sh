#!/bin/bash
export PATH=/usr/lib64/qt-3.3/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/opt/soft/node-v4.4.4-linux-x64/bin:/root/bin:/Users/boutell/npm/bin
modulesPath=$5/temp/mods/$3/
projectPath=$1
task=$2
pwd

if [ "$4" -eq "2" ]; then
  rm -rf $modulesPath
fi
echo $modulesPath
if [ ! -d $modulesPath ]; then
  mkdir -p $modulesPath
fi

cp -f $projectPath/package.json $modulesPath
cp -f $projectPath/package-lock.json $modulesPath
cp -f $projectPath/postcss.config.js $modulesPath
cd $modulesPath

#更新依赖库

if [ "$4" -eq "2" ]; then
cnpm install --save
fi
echo 'npm installed'

cd ../../../
pwd

cd $projectPath
pwd
echo '创建node_modules软连接  ln -s  ${modulesPath}/node_modules node_modules ---'
ln -s ../../mods/$3/node_modules ./node_modules
pwd

echo '开始构建'

$2
