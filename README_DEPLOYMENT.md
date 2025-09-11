# 🚀 Guide de déploiement complet - BoltAI

Ce guide vous explique comment déployer BoltAI sur GitHub et le rendre accessible au public.

## 🎯 Déploiement en 3 étapes

### 1. Configuration GitHub (Automatique)

```bash
# Exécuter le script de configuration
npm run setup:github
```

Ce script va :
- ✅ Installer GitHub CLI si nécessaire
- ✅ Créer un nouveau repository GitHub
- ✅ Configurer les topics et discussions
- ✅ Connecter votre repository local
- ✅ Pousser le code vers GitHub
- ✅ Créer les badges personnalisés

### 2. Ajouter les badges au README

Copiez le contenu de `BADGES_CUSTOM.md` dans votre `README.md` :

```markdown
# BoltAI - AI-Powered Code Generator

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/VOTRE_USERNAME/boltai)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)

[![AI Powered](https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)](#)
[![Code Generator](https://img.shields.io/badge/Code-Generator-4ECDC4?style=for-the-badge&logo=code&logoColor=white)](#)

## 🚀 Déploiement rapide

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VOTRE_USERNAME/boltai)
```

### 3. Déployer sur un cloud provider

#### Vercel (Recommandé)
1. Cliquez sur le badge "Deploy with Vercel"
2. Connectez votre compte GitHub
3. Ajoutez les variables d'environnement
4. Déployez !

#### Railway
1. Cliquez sur le badge "Deploy on Railway"
2. Connectez votre compte GitHub
3. Ajoutez une base de données PostgreSQL
4. Configurez les variables d'environnement
5. Déployez !

#### Render
1. Cliquez sur le badge "Deploy to Render"
2. Connectez votre compte GitHub
3. Configurez les commandes de build
4. Ajoutez les variables d'environnement
5. Déployez !

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

## 📊 Fonctionnalités incluses

### 🚀 Déploiement
- ✅ Configuration Vercel
- ✅ Configuration Railway
- ✅ Configuration Render
- ✅ Configuration Netlify
- ✅ Support Docker
- ✅ GitHub Actions CI/CD

### 🗄️ Base de données
- ✅ SQLite (développement)
- ✅ PostgreSQL (production)
- ✅ MySQL (alternative)
- ✅ Migration automatique

### 🔐 Sécurité
- ✅ Headers de sécurité
- ✅ Validation des entrées
- ✅ Gestion des erreurs
- ✅ Rate limiting

### 📚 Documentation
- ✅ Guide de déploiement
- ✅ Configuration des environnements
- ✅ Guide de contribution
- ✅ Templates d'issues

## 🎯 Scripts disponibles

```bash
# Configuration GitHub
npm run setup:github

# Déploiement
npm run deploy:vercel
npm run deploy:github

# Base de données
npm run db:sqlite      # SQLite pour développement
npm run db:postgres    # PostgreSQL pour production

# Vérification
npm run check-env      # Vérifier les variables d'environnement
npm run build:prod     # Build optimisé pour la production
```

## 🎉 Résultat final

Après le déploiement, vous aurez :

1. **Repository GitHub** avec :
   - Code source complet
   - Documentation détaillée
   - Templates d'issues et discussions
   - GitHub Actions configurées
   - Badges de déploiement

2. **Application déployée** avec :
   - Interface utilisateur moderne
   - Génération de code IA
   - Éditeur Monaco intégré
   - Terminal intégré
   - Authentification sécurisée

3. **Communauté** prête à :
   - Contribuer au projet
   - Signaler des bugs
   - Proposer des fonctionnalités
   - Partager des exemples

## 🆘 Support

- 📖 [Documentation complète](./README.md)
- 🐛 [Signaler un bug](https://github.com/VOTRE_USERNAME/boltai/issues)
- 💬 [Discussions](https://github.com/VOTRE_USERNAME/boltai/discussions)
- 📧 [Contacter les mainteneurs](https://github.com/VOTRE_USERNAME/boltai)

## 🎯 Prochaines étapes

1. **Partagez** votre repository avec la communauté
2. **Documentez** les fonctionnalités avancées
3. **Collectez** les retours des utilisateurs
4. **Améliorez** l'application basé sur les retours
5. **Créez** des templates et exemples

---

**Félicitations ! Votre projet BoltAI est maintenant prêt pour la production ! 🚀**