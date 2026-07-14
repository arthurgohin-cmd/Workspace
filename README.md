# CARVER INVEST

Site du marchand de biens CARVER INVEST (Paris · Cannes · Miami) : vitrine
publique bilingue FR/EN + back-office pour gérer les projets, l'équipe et les
messages, sans toucher au code.

## Stack technique

- [Next.js 16](https://nextjs.org) (App Router, Server Actions)
- [Prisma 7](https://www.prisma.io) + SQLite (base de données fichier)
- Authentification maison (session signée, cookie httpOnly) — un seul compte admin
- Tailwind CSS v4
- Traduction FR→EN automatique des fiches projets via l'API DeepL (optionnelle)

Aucun compte tiers n'est requis pour faire tourner le site en local. Un
hébergeur avec **disque persistant** (pas de serverless "sans état") est
nécessaire en production — voir [Déploiement](#déploiement).

## Démarrer en local

```bash
npm install
cp .env.example .env   # puis complétez SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npx prisma migrate deploy
npm run db:seed        # crée le compte admin + les 6 projets connus
npm run dev
```

Le site est sur http://localhost:3000 (redirige vers `/fr`), l'admin sur
http://localhost:3000/admin/login avec les identifiants définis dans `.env`.

Générer un `SESSION_SECRET` : `openssl rand -base64 32`.

## Administrer le site

Tout se passe dans `/admin` une fois connecté :

- **Projets** — créer/modifier une fiche (ville, statut, surface, montant,
  résumé, description, dates), gérer les photos/vidéos/visites 3D, marquer un
  projet "en avant" sur l'accueil.
- **Équipe** — ajouter les membres avec photo, rôle, bio.
- **Messages** — messages du formulaire de contact et des demandes
  investisseurs, avec statut traité/à traiter.

La traduction anglaise des résumés/descriptions est générée automatiquement à
l'enregistrement si `DEEPL_API_KEY` est configurée dans `.env` (clé gratuite
sur deepl.com/pro-api). Sans clé, le texte anglais reprend le texte français
saisi — à corriger manuellement si besoin en attendant.

## Contenu à compléter

Les 6 projets connus (appartement Paris, villa Castellaras, villa Miami,
2 résidences Miami, villa Mandelieu-la-Napoule) sont pré-créés avec les
informations réelles connues (ville, localisation, statut). Le reste
(photos, vidéos, surfaces, montants, descriptions, équipe, mentions légales)
est à renseigner depuis l'admin.

Le nom de domaine et les informations légales (SIRET, forme juridique, siège
social) ne sont pas encore intégrés — le pied de page l'indique
provisoirement.

## Déploiement

Le site a besoin de deux choses persistantes sur le disque du serveur :

1. `dev.db` (base SQLite) — ou basculez sur Postgres/MySQL en production en
   changeant le `provider` dans `prisma/schema.prisma` et en adaptant
   `src/lib/db.ts` (adapter Prisma correspondant).
2. `storage/uploads/` — les photos/vidéos envoyées depuis l'admin. Ce dossier
   est volontairement en dehors de `public/` (Next.js ne détecte pas les
   fichiers ajoutés à `public/` après le démarrage du serveur) ; il est servi
   par la route `src/app/uploads/[...path]/route.ts`.

Cela exclut les hébergeurs serverless "sans disque" (ex. Vercel par défaut).
Un serveur Node.js classique convient (VPS, Railway, Render, Fly.io, Docker) :

```bash
npm run build
npx prisma migrate deploy
npm run db:seed   # première mise en route uniquement
npm run start
```

Pensez à sauvegarder régulièrement `dev.db` et `storage/uploads/`.

## Structure

```
src/app/[locale]/        pages publiques (fr/en)
src/app/admin/           back-office (login public, reste protégé)
src/app/uploads/         route qui sert les fichiers uploadés
src/components/          composants partagés (header, footer, cartes…)
src/lib/                 accès DB, auth, upload, traduction, validation
src/i18n/                dictionnaires FR/EN
prisma/schema.prisma     modèle de données
prisma/seed.ts           compte admin + projets initiaux
```
