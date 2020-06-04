# MOSY
## Info an uns:
:exclamation: Den master branch bitte erstmal so lassen (**nicht** mit *git push origin master* pushen). :exclamation: <br>
Im Moment im profile branch arbeiten (mit *git push origin profile* pushen).


## Nützliche Informationen zu Git:
### https://docs.gitlab.com/ee/gitlab-basics/start-using-git.html
```
Die erste Konfiguration
git config --global user.name "your_username"
git config --global user.email "your_email_address@example.com"


git add .
(-> alle geänderten Dateien werden hinzugefügt - kann jedoch manchmal nicht klappen, 
daher eher alle einzelnd hinzufügen)
oder 		
git add screens/ProfileScreen.js 	
(-> geänderte Datei hinzufügen)

git commit -m "COMMENT TO DESCRIBE THE INTENTION OF THE COMMIT"  	
(-> commit bestätigen)

git push origin master		
oder 		
git push origin profile	
(-> lädt alle Änderungen auf GitHub.com hoch)

git status 		(-> aktuelle Änderungen ansehen)

git pull 		(-> aktuellste Dateien in GitHub holen)
```
