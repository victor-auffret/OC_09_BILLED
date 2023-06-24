historique des modifications apportées au projet 

/containers/Login.js
 - changer employee en admin 

/app/format.js 
 - utiliser substring au lieu de substr

/views/BillsUI.js 
 - utilisation de sort pour trier les données avant affichage

/__tests__/Bills.js
 - ajout du test active-icon sur le paneau latéral 

/containers/Bills.js
 - deplacement de style='text-align: center;' au fichier css
/css/bills.css

/containers/Dashboard.js
 - unbind("click") + utilisation d'un booleen au lieu d'un counter

/views/NewBillUI.js
 - ajout de accept="image/png, image/jpeg" puis de "image/*"

/containers/NewBill.js
 - test acceptedMimeType pour filtrer sur les images
 - supprimer fichier si mauvais mime type
  const dt = new DataTransfer()
  input.files = dt.files
 - empêcher envoie de données + redirection avec submit si fileName null

/__tests__/NewBill.js 
 - champs vides lors du chargement de la page
 - test appel de submit
 - test changement fichier non image 
-------------------------

tests unitaires / intégrations 

/__tests__/Login.js 
 - ajout test utiliser mdp admin avec formulaire employee
 - ajout test utiliser mdp employe avec formulaire admin 

/__tests__/Bills.js
 - test "new bills button"
 - test "format date load bills mock"
 - test "open modale" => echec à cause de bootstrap
 - "fix" du bug de bootstrap en ajoutant une condition dans containers/Bills.js


-------------------------

tests end to end (parcours employé)
 
