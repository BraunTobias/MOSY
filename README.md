# MOSY
## Info an uns:
:exclamation: Den master branch und profile branch bitte erstmal so lassen 
<br> (**nicht** mit *git push origin master* oder *git push origin profile* pushen). :exclamation: <br>

Im Moment im database branch arbeiten (mit *git push origin database* pushen).


## Nützliche Informationen zu Git:
### https://docs.gitlab.com/ee/gitlab-basics/start-using-git.html
```
Die erste Konfiguration
git config --global user.name "your_username"
git config --global user.email "your_email_address@example.com"


1) git add .
(-> alle geänderten Dateien werden hinzugefügt - kann jedoch manchmal nicht klappen, 
daher eher alle einzelnd hinzufügen)
oder 		
git add screens/ProfileScreen.js 	
(-> geänderte Datei hinzufügen)

2) git commit -m "COMMENT TO DESCRIBE THE INTENTION OF THE COMMIT"  	
(-> commit bestätigen)

3) git push origin branchname 
(Beispiel: git push origin master)
(-> lädt alle Änderungen auf GitHub.com hoch)

git status 		(-> aktuelle Änderungen ansehen)

git pull 		(-> aktuellste Dateien in GitHub holen)
```
