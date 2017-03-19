#!/bin/bash


currentPath=$PWD
databaseUsername="root"
databasePassword="mikotek@TW"
databaseName="pms"

#if prior install failed, clear this lock file
sudo rm /var/lib/apt/lists/lock
sudo rm /var/cache/apt/archives/lock


#unzip relative debs
cd /tmp
tar -xvf $currentPath/offlinePackage.tar

#backup old repo list
cp /etc/apt/sources.list /etc/apt/sources.list.old

#add apt-get repo url
echo "deb file:/tmp/offlinePackage/ /" > '/etc/apt/sources.list'

#update repo list
apt-get update

#set installer with no gui
export DEBIAN_FRONTEND=noninteractive

#mysql
DEBIAN_FRONTEND=noninteractive apt-get install mysql-server-5.5 -y --force-yes
mysqladmin -u $databaseUsername password $databasePassword
#create DB
mysql -u$databaseUsername -p$databasePassword < $currentPath/pms_structure.sql
#create simple data
mysql -u$databaseUsername -p$databasePassword < $currentPath/pms_data.sql

#install node js
DEBIAN_FRONTEND=noninteractive apt-get install build-essential libssl-dev -y --force-yes
DEBIAN_FRONTEND=noninteractive apt-get install nodejs -y --force-yes



#install java
mkdir /opt/jdk
tar -zxf /tmp/offlinePackage/jdk-8u5-linux-x64.tar.gz -C /opt/jdk
ls /opt/jdk
update-alternatives --install /usr/bin/java java /opt/jdk/jdk1.8.0_05/bin/java 100
update-alternatives --install /usr/bin/javac javac /opt/jdk/jdk1.8.0_05/bin/javac 100


#remove the repo for install
rm /etc/apt/sources.list

#restore origin repo
cp /etc/apt/sources.list.old /etc/apt/sources.list


#npm

#install pm2 for global
#1.copy to npm install folder
cp -R /tmp/offlinePackage/pm2 /usr/lib/node_modules

#2.add execute attr
chmod +x ./pm2

#3.add link to global bin folder
ln -s /usr/lib/node_modules/pm2/bin/pm2 /usr/bin
ln -s /usr/lib/node_modules/pm2/bin/pm2-dev /usr/bin
ln -s /usr/lib/node_modules/pm2/bin/pm2-docker /usr/bin
ln -s /usr/lib/node_modules/pm2/bin/rundev /usr/bin



file="/usr/share/pms/src"
if [ -d "$file" ]
then
	echo "starting server"
	mysql -u$databaseUsername -p$databasePassword $databaseName < $file/pms.sql
	cd $file
	npm install
	cd ..
	node src/app.js
else
	echo "$file not found."
fi
