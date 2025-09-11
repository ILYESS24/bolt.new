# 🚀 Guide de déploiement GitHub - BoltAI

Ce guide vous explique comment déployer votre projet BoltAI sur GitHub étape par étape.

## 📋 Prérequis

- Compte GitHub
- Git installé sur votre machine
- GitHub CLI (optionnel mais recommandé)

## 🎯 Étapes de déploiement

### 1. Créer un nouveau repository GitHub

#### Option A: Via l'interface GitHub
1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur le bouton "New" ou "+" → "New repository"
3. Nommez votre repository : `boltai` ou `boltai-clone`
4. Description : `🤖 BoltAI - AI-Powered Code Generator inspired by bolt.new`
5. Choisissez "Public" pour le rendre accessible à tous
6. **Ne cochez PAS** "Initialize with README" (nous avons déjà un README)
7. Cliquez sur "Create repository"

#### Option B: Via GitHub CLI (recommandé)
```bash
# Installer GitHub CLI si pas déjà fait
# macOS: brew install gh
# Windows: winget install GitHub.cli
# Linux: sudo apt install gh

# Se connecter à GitHub
gh auth login

# Créer le repository
gh repo create boltai --public --description "🤖 BoltAI - AI-Powered Code Generator inspired by bolt.new"
```

### 2. Connecter votre repository local

```bash
# Supprimer l'ancien remote (si existe)
git remote remove origin

# Ajouter votre nouveau repository
git remote add origin https://github.com/VOTRE_USERNAME/boltai.git

# Pousser le code vers GitHub
git push -u origin boltai-main
```

### 3. Créer la branche main

```bash
# Créer et basculer sur la branche main
git checkout -b main

# Pousser la branche main
git push -u origin main

# Supprimer l'ancienne branche locale
git branch -d boltai-main
```

### 4. Configurer le repository

#### Ajouter des topics (tags)
Dans les paramètres du repository GitHub :
1. Allez dans "About" (à droite)
2. Cliquez sur l'icône d'engrenage
3. Ajoutez ces topics :
   - `nextjs`
   - `typescript`
   - `ai`
   - `code-generator`
   - `monaco-editor`
   - `tailwindcss`
   - `prisma`
   - `vercel`
   - `bolt-clone`

#### Configurer les discussions
1. Allez dans "Settings" → "General"
2. Activez "Discussions" dans la section "Features"
3. Cela permettra aux utilisateurs de poser des questions

### 5. Ajouter les badges de déploiement

Copiez ce contenu dans votre README.md :

```markdown
# BoltAI - AI-Powered Code Generator

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/VOTRE_USERNAME/boltai)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black.svg)](https://nextjs.org/)

[![AI Powered](https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)](#)
[![Code Generator](https://img.shields.io/badge/Code-Generator-4ECDC4?style=for-the-badge&logo=code&logoColor=white)](#)

## 🚀 Déploiement rapide

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VOTRE_USERNAME/boltai)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/boltai)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/VOTRE_USERNAME/boltai)
```

## 🚀 Déploiement automatique

### Vercel (Recommandé)

1. Allez sur [Vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Cliquez sur "Import Project"
4. Sélectionnez votre repository `boltai`
5. Vercel détectera automatiquement Next.js
6. Ajoutez les variables d'environnement :
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-super-secret-key
   DATABASE_URL=your-database-url
   OPENAI_API_KEY=your-openai-api-key
   ```
7. Cliquez sur "Deploy"

### Railway

1. Allez sur [Railway.app](https://railway.app)
2. Connectez votre compte GitHub
3. Cliquez sur "New Project"
4. Sélectionnez "Deploy from GitHub repo"
5. Choisissez votre repository `boltai`
6. Ajoutez une base de données PostgreSQL
7. Configurez les variables d'environnement
8. Le déploiement se fera automatiquement

### Render

1. Allez sur [Render.com](https://render.com)
2. Connectez votre compte GitHub
3. Cliquez sur "New" → "Web Service"
4. Connectez votre repository `boltai`
5. Configurez :
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Environment: Node.js 18
6. Ajoutez les variables d'environnement
7. Cliquez sur "Create Web Service"

## 🔑 Variables d'environnement

### Obligatoires
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key
DATABASE_URL=your-database-connection-string
OPENAI_API_KEY=your-openai-api-key
```

### Optionnelles
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 📊 Configuration GitHub Actions

Votre repository inclut déjà une configuration GitHub Actions qui :
- ✅ Exécute les tests automatiquement
- ✅ Vérifie la qualité du code
- ✅ Déploie automatiquement sur Vercel
- ✅ Crée des previews pour les Pull Requests

## 🎯 Scripts de déploiement

### Déploiement automatique GitHub
```bash
npm run deploy:github
```

### Déploiement manuel
```bash
# Vercel
npm run deploy:vercel

# Railway
npm run deploy railway

# Render
npm run deploy render
```

## 📚 Documentation incluse

Votre repository inclut une documentation complète :
- [Guide de déploiement](./docs/DEPLOYMENT.md)
- [Configuration des bases de données](./docs/DATABASE_SETUP.md)
- [Configuration des environnements](./docs/ENVIRONMENT_SETUP.md)
- [Comparaison des fournisseurs cloud](./docs/CLOUD_PROVIDERS.md)
- [Guide de démarrage rapide](./docs/QUICK_START.md)
- [Guide de contribution](./CONTRIBUTING.md)

## 🎉 Félicitations !

Votre projet BoltAI est maintenant déployé sur GitHub et prêt à être utilisé par la communauté !

### Prochaines étapes

1. **Partagez** votre repository avec la communauté
2. **Documentez** les fonctionnalités avancées
3. **Collectez** les retours des utilisateurs
4. **Améliorez** l'application basé sur les retours
5. **Créez** des templates et exemples

### Liens utiles

- **Repository** : https://github.com/VOTRE_USERNAME/boltai
- **Issues** : https://github.com/VOTRE_USERNAME/boltai/issues
- **Discussions** : https://github.com/VOTRE_USERNAME/boltai/discussions
- **Actions** : https://github.com/VOTRE_USERNAME/boltai/actions

Happy coding! 🚀