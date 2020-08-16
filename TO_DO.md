update 16.08.2020

- s.u.
- das inline css bitte möglichst entfernen! -> canvas width & height, diverse cursor:default Angaben
- neue Funktionen:
  - preloader (Achtung, neues js: lib/threejs/ColladaLoader.js und neuer htmlcode über #scene: <section id="loading-screen"><div id="loader"></div></section>)
  - scalePercent im popup raus
  - Perspektive/ FOV geändert
  - Kameraanimation zum Hotspot, auf Klick oder auch Link (wenn li class="animated" gesetzt), (neues js: lib/tween/Tween.js)

Todo liste am 27.07.2020

- Frage : Kann man der Bildverzerrung irgendwo einstellen => 3D effekt reduzieren ? 
  - klar, ich habe das field of view mal von 75 auf 45 Grad eingestellt.
- Frage : Kann man die Bildbreite irgendwo einstellen => etwas minimal breiter festlegen ?
  - minimal breiter? meinste schmaler? was passiert mit dem Rest? Ist etwas aufwendiger, haut dann mit dem Hover nicht mehr so recht hin...
    

- editmode => wenn mann ein punk auf der seite schibt, solte er sich nicht verzehren 
  - ist das mit dem reduzierten 3D Effekt schon besser? Ansonsten müsste man die 3d auf die Bildschirmkoordinaten umrechnen.

- editmode => Ausbage minimal ändern (scalePercent raus nehmen, brauchen wir nicht oder ?)
"x":-58", y":8", z":-62", scalePercent":126 => "x":"-58", "y":8","z":"-62"
  - ist angepasst! 
- Lade Balken ?
  - 'Ladekreise' sind drin

- Fehler bei Firexox ? diese URL funkzioniert in Chrome und Safari sehr gut, aber nicht in Firefox (POI werden nicht angezeigt) weist du Warum ?
    http://116.203.103.232/dev-digitale-kirche/
  - liegt evt. am svg vom poi, kannst du das mal mit png testen?
  


Todo liste am 26.06.2020

- Slider mit Pfeile zum kliken für die desktopversion
    - sind drin
- Bouton in der Scene zu andere Scene 
    - kann man doch verlinken!?
- EDIT modus einfache variente vorschlag : kreuz im zentrum mit anzeige der koordinate (dann könnte mann die werte kopieren)
    - geht jetzt über Parameteraufruf:  
    - http://127.0.0.1:5500/index.html?mode=edit
    - +, - zum skalieren
    - nach Beendigung Popup mit Daten

