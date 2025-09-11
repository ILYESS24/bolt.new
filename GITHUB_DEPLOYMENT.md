# 🚀 Déploiement GitHub - BoltAI

Ce guide vous explique comment déployer BoltAI sur GitHub et le rendre accessible au public.

## 📋 Étapes de déploiement

### 1. Créer un nouveau repository GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur "New repository"
3. Nommez votre repository : `boltai` ou `boltai-clone`
4. Choisissez "Public" pour le rendre accessible
5. **Ne cochez PAS** "Initialize with README" (nous avons déjà un README)
6. Cliquez sur "Create repository"

### 2. Connecter le repository local

```bash
# Supprimer l'ancien remote
git remote remove origin

# Ajouter votre nouveau repository
git remote add origin https://github.com/VOTRE_USERNAME/boltai.git

# Pousser le code
git push -u origin boltai-main
```

### 3. Créer la branche main

```bash
# Créer et basculer sur main
git checkout -b main

# Pousser la branche main
git push -u origin main

# Supprimer l'ancienne branche
git branch -d boltai-main
```

## 🔧 Configuration du repository

### Ajouter des topics (tags)

Dans les paramètres du repository, ajoutez ces topics :
- `nextjs`
- `typescript`
- `ai`
- `code-generator`
- `monaco-editor`
- `tailwindcss`
- `prisma`
- `vercel`
- `bolt-clone`

### Description du repository

```
🤖 BoltAI - AI-Powered Code Generator inspired by bolt.new

✨ Features:
- AI code generation with OpenAI GPT-4
- Monaco Editor with syntax highlighting
- Multi-file project management
- Integrated terminal
- Authentication with NextAuth.js
- Public/private project sharing
- Responsive design with TailwindCSS

🚀 Deploy to Vercel, Railway, Render, or any cloud provider
```

## 🚀 Déploiement automatique

### Vercel (Recommandé)

1. Allez sur [Vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Importez votre repository `boltai`
4. Vercel détectera automatiquement Next.js
5. Ajoutez les variables d'environnement
6. Déployez !

### Railway

1. Allez sur [Railway.app](https://railway.app)
2. Connectez votre compte GitHub
3. Créez un nouveau projet
4. Sélectionnez votre repository `boltai`
5. Ajoutez une base de données PostgreSQL
6. Configurez les variables d'environnement
7. Déployez !

### Render

1. Allez sur [Render.com](https://render.com)
2. Connectez votre compte GitHub
3. Créez un nouveau "Web Service"
4. Sélectionnez votre repository `boltai`
5. Configurez :
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
6. Ajoutez les variables d'environnement
7. Déployez !

## 🔑 Variables d'environnement

### Obligatoires

```env
NEXTAUTH_URL=https://your-app.vercel.app
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

## 📊 Badges pour le README

Ajoutez ces badges à votre README.md :

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VOTRE_USERNAME/boltai)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/boltai)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/VOTRE_USERNAME/boltai)
```

## 🎯 Scripts de déploiement

### Déploiement rapide

```bash
# Vercel
npm run deploy:vercel

# Railway
npm run deploy railway

# Render
npm run deploy render
```

### Vérification

```bash
# Vérifier l'environnement
npm run check-env

# Build de production
npm run build:prod
```

## 📚 Documentation

- [Guide de déploiement complet](./docs/DEPLOYMENT.md)
- [Configuration des bases de données](./docs/DATABASE_SETUP.md)
- [Configuration des environnements](./docs/ENVIRONMENT_SETUP.md)
- [Comparaison des fournisseurs cloud](./docs/CLOUD_PROVIDERS.md)
- [Guide de démarrage rapide](./docs/QUICK_START.md)

## 🆘 Support

- Ouvrez une [issue](https://github.com/VOTRE_USERNAME/boltai/issues) pour les bugs
- Créez une [discussion](https://github.com/VOTRE_USERNAME/boltai/discussions) pour les questions
- Consultez la [documentation](./README.md) pour plus d'informations

## 🎉 Félicitations !

Votre projet BoltAI est maintenant déployé sur GitHub et prêt à être utilisé par la communauté !

### Prochaines étapes

1. **Partagez** votre repository avec la communauté
2. **Documentez** les fonctionnalités avancées
3. **Collectez** les retours des utilisateurs
4. **Améliorez** l'application basé sur les retours
5. **Créez** des templates et exemples

Happy coding! 🚀