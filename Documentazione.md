# Documentazione vvfire

VVFire è una piattaforma realizzata in VueJS + vue-material e destinata ai vigili del fuoco. 
Permette di gestire la reperibilità del personale e coordinare gli interventi di ricerca persona (è stata progettata in modo che in futuro venga usata anche da altri corpi).
<br>
I dati vengono gestiti dall'api scritta in SailsJS la quale comunica con il gestionale web e con l'app che sfortunatamente è ancora in via di sviluppo (quindi per impostare la propria reperibilità o partecipare a una ricerca persona inviando posizioni gps, è possibile solo chiamando direttamente gli endpoint dell'api).
<br>

## Routes

- *'/'*
  - Landing page
- *'/login'*
  - Pagina di login
- *'/reperibilita'*
  - Mostra un calendario interattivo il quale visualizza gli orari in cui c'è del personale disponiobile. Cliccando sull'evento mostrerà informazioni aggiuntive
- *'/impostazioni'*
  - Permette eliminare o aggiornare le informazioni relative al corpo
- *'/ricercapersona'*
  - Permette di creare, modificare, eliminare o completare una ricerca persona
- *'/ricercapersona/missioni/:id'*
  - Permette di gestire le missioni relative alla ricerca persona. Le missioni sono suddivise in giorno e per ogniuna è possibile modificarla, eliminarla o completarla
- *'/ricercapersona/missioni/dettagli/:id'*
  - Visualizza una lista con i vigili partecipanti e una mappa topografica con le tracce gps relative alla missione selezionata.
- *'/ricercapersona/missioni/riepilogo-giornaliero'*
  - Visualizza una mappa con tutte le tracce gps della giornata di una ricerca persona.
- *'/ricercapersona/missioni/riepilogo-complessivo'*
  - Visualizza una mappa con tutte le tracce gps della ricerca persona selezionata.
- *'/ricercapersona/livemap/id'*
  - Visualizza l'ultima posizione dei soccorritori negli ultimi 5 minuti.

<br>

## App Structure

- src
  - assets
    - contiene immagini e un file css
  - components
    - contiene alcuni componenti (soprattuto dialog)
  - controllers
    - all'interno ci sono tutte le funzioni che interagiscono con l'api
  - layout
    - all'interno ci sono i due layout principali (Home e Dashboard), tutte le viste vengono visualizzate all'interno dei layout
  - router
    - contiene appunto le routes
  - views
    - all'interno ci sono tutti file delle viste quindi le impostazioni, reperibilita, le ricerche, mappe ecc.
- .env
  - contiene la variabile d'ambiente *VUE_APP_API_SERVER*, cioè l'endpoint dell'api


<br>

Se per sfortuna l'api ha problemi, non risponde ecc. (Legge di Murphy), una delle soluzioni
per testare la piattaforma è utilizzarla in locale:
- scaricare l'api da [https://github.com/asdf1899/vvfire-api](https://github.com/asdf1899/vvfire-api) 
- dentro */vvfire-api/* eseguire il comando *npm install*
- aprire xampp far partire sia Apache che MySQL
- dal browser aprire *phpmyadmin* ed eseguire questo [SQL]() per installare il database
- una volta completati i passaggi precedenti, eseguire il comando *sails lift*
- se tutto va bene l'api verrà servita in *"http://localhost:1337"*
- apire *vvfire-web* e all'interno del file *.env* sostituire l'url con *http://localhost:1337*
- sempre in vvfire-web tramite cli eseguire il comando *npm run serve*   

Per qualsiasi problema contattatemi via mail o su Telegram [@asdf1899](https://t.me/asdf1899)