#!/bin/bash

echo "🚀 === DÉPLOIEMENT AUTOMATIQUE SUR GITHUB ==="
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

# Vérifier que Git est initialisé
if [ ! -d ".git" ]; then
    echo "📦 Initialisation du dépôt Git..."
    git init
    git branch -M main
fi

# Ajouter tous les fichiers
echo "📁 Ajout des fichiers au dépôt Git..."
git add .

# Créer un commit
echo "💾 Création du commit..."
git commit -m "🚀 Déploiement automatique - Application BoltAI complète

✨ Fonctionnalités implémentées:
- Interface glassmorphique moderne en noir et blanc
- Générateur d'applications IA avancé
- Éditeur visuel avec drag & drop
- WebContainer simplifié pour l'environnement de développement
- Système de prévisualisation en temps réel
- Correction automatique des erreurs
- Déploiement multi-cloud (Vercel, Railway, Render, Netlify)
- Authentification NextAuth.js
- Base de données Prisma avec support multi-provider
- API routes complètes pour CRUD
- Interface Studio complète
- Build réussi sans erreurs

🎯 Prêt pour le déploiement sur Vercel et autres plateformes cloud!"

# Vérifier si un remote origin existe
if git remote get-url origin >/dev/null 2>&1; then
    echo "🔄 Mise à jour du dépôt existant..."
    git push origin main
else
    echo "📤 Création d'un nouveau dépôt GitHub..."
    echo ""
    echo "Pour créer un nouveau dépôt GitHub:"
    echo "1. Allez sur https://github.com/new"
    echo "2. Créez un nouveau dépôt (ex: boltai-app)"
    echo "3. Exécutez: git remote add origin https://github.com/VOTRE_USERNAME/boltai-app.git"
    echo "4. Exécutez: git push -u origin main"
    echo ""
    echo "Ou utilisez GitHub CLI si installé:"
    echo "gh repo create boltai-app --public --source=. --remote=origin --push"
fi

echo ""
echo "✅ === DÉPLOIEMENT TERMINÉ ==="
echo ""
echo "🎉 Votre application BoltAI est maintenant prête!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Créez un dépôt GitHub si ce n'est pas déjà fait"
echo "2. Déployez sur Vercel: https://vercel.com/new"
echo "3. Configurez les variables d'environnement"
echo "4. Profitez de votre application!"
echo ""
echo "🔗 Liens utiles:"
echo "- Documentation: README.md"
echo "- Déploiement: docs/DEPLOYMENT.md"
echo "- Configuration: .env.example"
echo ""