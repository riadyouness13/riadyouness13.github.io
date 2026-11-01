# ePortfolio de Youness Riad

Site statique (HTML, CSS, JavaScript) bilingue français / anglais, publié avec GitHub Pages à l'adresse :
**https://riadyouness13.github.io**

## Mettre le site en ligne (10 minutes)

1. Connecte-toi sur github.com avec le compte **riadyouness13**.
2. Clique sur **New repository**. Nomme-le exactement `riadyouness13.github.io` (le nom du compte suivi de .github.io), laisse-le **Public**, puis **Create repository**.
3. Sur la page du dépôt vide, clique sur **uploading an existing file**.
4. Ouvre le dossier `portfolio` dans l'explorateur de fichiers, sélectionne **tout son contenu** (les fichiers ET les dossiers `assets` et `cv`) et fais-le glisser dans la page. Ne passe pas par « choose your files » : ce bouton n'envoie pas les dossiers.
5. Clique sur **Commit changes**.
6. Va dans **Settings → Pages** : vérifie que la source est **Deploy from a branch**, branche `main`, dossier `/ (root)`.
7. Attends 1 à 2 minutes, puis ouvre https://riadyouness13.github.io

Pour le rendu Moodle, dépose le lien du site (et les deux CV si un fichier est demandé).

## Compléter plus tard

| Quoi | Où |
| --- | --- |
| Ta photo | Ajoute un fichier `assets/photo.jpg` (format portrait). Elle s'affiche automatiquement à la place des initiales. |
| Lien LinkedIn | Dans `script.js`, ligne `linkedin: ""`, colle l'adresse de ton profil entre les guillemets. |
| Vidéo pitch | Mets la vidéo sur YouTube en « Non répertoriée », puis dans `script.js`, ligne `youtubeId: ""`, colle l'identifiant (ce qui suit `v=` dans l'adresse). |
| CV | Remplace les fichiers du dossier `cv/` en gardant les mêmes noms. |
| Textes | Tout est dans `index.html`. Chaque texte existe en double : `data-l="fr"` pour le français, `data-l="en"` pour l'anglais. Modifie toujours les deux. |

Pour modifier un fichier directement sur GitHub : ouvre-le, clique sur l'icône crayon, modifie, puis **Commit changes**.

## Structure

- `index.html` : les 6 onglets demandés (Welcome, Engineering course, International Mobility, Sustainability & Civic Engagement, Sport & other activities, Career Development) et leurs sous-onglets
- `style.css` : la mise en forme
- `script.js` : bascule FR/EN, navigation par onglets, liens LinkedIn et vidéo, démo interactive du voyageur de commerce
- `assets/fonts/` : polices hébergées sur le site (aucun appel à Google, plus respectueux du RGPD)
- `cv/` : CV en français et en anglais (PDF)
