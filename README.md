# Projektname

## Repository klonen

Um das Repository zu klonen, führe den folgenden Befehl im Terminal aus:

```sh
git clone https://github.com/swissglider/hao_webapp_v2.git
cd hao_webapp_v2
```

## Öffne Stammverzeichnis in VSCode

   ```sh
   code .
   ```

## DevContainer einrichten

### Frontend

1. Navigiere in das `frontend` Verzeichnis:
   ```sh
   cd frontend
   ```

2. Öffne Visual Studio Code im `frontend` Verzeichnis:
   ```sh
   code .
   ```

3. Öffne das Command Palette mit `Cmd+Shift+P` und wähle `Remote-Containers: Reopen in Container`.

### Backend

1. Navigiere in das `backend` Verzeichnis:
   ```sh
   cd backend
   ```

2. Öffne Visual Studio Code im `backend` Verzeichnis:
   ```sh
   code .
   ```

3. Öffne das Command Palette mit `Cmd+Shift+P` und wähle `Remote-Containers: Reopen in Container`.

## Anwendung starten

### Frontend

1. Stelle sicher, dass du im `frontend` Verzeichnis bist.
2. Führe den folgenden Befehl aus, um die Anwendung zu starten:
   ```sh
   npm run dev
   ```

### Backend

1. Stelle sicher, dass du im `backend` Verzeichnis bist.
2. `.env` Datei muss im verzeichnis bakend Verzeichnis erstellt werden
3. Führe den folgenden Befehl aus, um die Anwendung zu starten:
   ```sh
   npm start
   ```

## Änderungen synchronisieren

Um deine Änderungen nach GitHub zu synchronisieren, folge diesen Schritten (im Stammverzeichnis VSC):

0. **Status abfragen:**
   ```sh
   git status
   ```

1. **Änderungen hinzufügen:**
   ```sh
   git add .
   ```

2. **Änderungen committen:**
   ```sh
   git commit -m "Beschreibe deine Änderungen"
   ```

3. **Änderungen pushen:**
   ```sh
   git push origin master
   ```

Damit werden deine Änderungen nach GitHub synchronisiert.

## Verzeichnisstruktur

Eine Übersicht über die Verzeichnisstruktur des Projekts.

```
<Projektverzeichnis>/
├── backend/
├── frontend/
├── devcontainer/
├── node_modules/
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

## Beitrag

Anweisungen, wie andere zum Projekt beitragen können.

1. Forke das Repository
2. Erstelle einen neuen Branch (`git checkout -b feature/NeuesFeature`)
3. Committe deine Änderungen (`git commit -m 'Füge ein neues Feature hinzu'`)
4. Push den Branch (`git push origin feature/NeuesFeature`)
5. Erstelle einen Pull Request

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert – siehe die [LICENSE](LICENSE)-Datei für Details.
