#!/bin/bash

# Script de configuration GitHub pour BoltAI
set -e

echo "🚀 Configuration GitHub pour BoltAI..."

# Vérifier si GitHub CLI est installé
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI n'est pas installé."
    echo "📥 Installation de GitHub CLI..."
    
    # Détecter l'OS et installer GitHub CLI
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install gh
        else
            echo "❌ Homebrew n'est pas installé. Veuillez installer GitHub CLI manuellement."
            echo "📖 Guide: https://cli.github.com/manual/installation"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh
    else
        echo "❌ OS non supporté. Veuillez installer GitHub CLI manuellement."
        echo "📖 Guide: https://cli.github.com/manual/installation"
        exit 1
    fi
fi

# Vérifier si l'utilisateur est connecté à GitHub
if ! gh auth status &> /dev/null; then
    echo "🔐 Connexion à GitHub..."
    gh auth login
fi

# Demander le nom d'utilisateur GitHub
read -p "👤 Entrez votre nom d'utilisateur GitHub: " GITHUB_USERNAME

# Demander le nom du repository
read -p "📁 Entrez le nom du repository (défaut: boltai): " REPO_NAME
REPO_NAME=${REPO_NAME:-boltai}

# Demander si le repository doit être public
read -p "🌐 Voulez-vous un repository public? (y/n, défaut: y): " IS_PUBLIC
IS_PUBLIC=${IS_PUBLIC:-y}

# Créer le repository sur GitHub
echo "📦 Création du repository sur GitHub..."

if [ "$IS_PUBLIC" = "y" ]; then
    gh repo create $REPO_NAME --public --description "🤖 BoltAI - AI-Powered Code Generator inspired by bolt.new" --add-readme=false
else
    gh repo create $REPO_NAME --private --description "🤖 BoltAI - AI-Powered Code Generator inspired by bolt.new" --add-readme=false
fi

# Ajouter les topics
echo "🏷️  Ajout des topics..."
gh repo edit $GITHUB_USERNAME/$REPO_NAME --add-topic "nextjs,typescript,ai,code-generator,monaco-editor,tailwindcss,prisma,vercel,bolt-clone"

# Activer les discussions
echo "💬 Activation des discussions..."
gh api repos/$GITHUB_USERNAME/$REPO_NAME --method PATCH --field has_discussions=true

# Supprimer l'ancien remote s'il existe
if git remote get-url origin >/dev/null 2>&1; then
    echo "🔄 Suppression de l'ancien remote..."
    git remote remove origin
fi

# Ajouter le nouveau remote
echo "🔗 Ajout du nouveau remote..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Créer une nouvelle branche main
echo "🌿 Création de la branche main..."
git checkout -b main

# Pousser vers GitHub
echo "⬆️  Poussage vers GitHub..."
git push -u origin main

# Créer un fichier de badges personnalisé
echo "🏷️  Création des badges personnalisés..."
cat > BADGES_CUSTOM.md << EOF
# 🏷️ Badges personnalisés pour $REPO_NAME

## Déploiement rapide

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/$GITHUB_USERNAME/$REPO_NAME)

### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/$REPO_NAME)

### Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/$GITHUB_USERNAME/$REPO_NAME)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/$GITHUB_USERNAME/$REPO_NAME)

## Badges d'information

\`\`\`markdown
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/$GITHUB_USERNAME/$REPO_NAME)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-38B2AC.svg)](https://tailwindcss.com/)

[![AI Powered](https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)](#)
[![Code Generator](https://img.shields.io/badge/Code-Generator-4ECDC4?style=for-the-badge&logo=code&logoColor=white)](#)
[![Monaco Editor](https://img.shields.io/badge/Editor-Monaco-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)](#)
\`\`\`
EOF

# Afficher les informations de déploiement
echo ""
echo "✅ Configuration GitHub terminée avec succès !"
echo ""
echo "📋 Informations du repository:"
echo "   URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "   Clone: git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Allez sur https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "   2. Copiez les badges de BADGES_CUSTOM.md dans votre README.md"
echo "   3. Déployez sur Vercel, Railway, ou Render"
echo "   4. Configurez les variables d'environnement"
echo "   5. Partagez avec la communauté !"
echo ""
echo "🔑 Variables d'environnement requises:"
echo "   NEXTAUTH_URL=https://your-domain.com"
echo "   NEXTAUTH_SECRET=your-secret-key"
echo "   DATABASE_URL=your-database-url"
echo "   OPENAI_API_KEY=your-openai-api-key"
echo ""
echo "📚 Documentation disponible:"
echo "   - DEPLOY_TO_GITHUB.md - Guide complet"
echo "   - BADGES_CUSTOM.md - Badges personnalisés"
echo "   - docs/ - Documentation détaillée"
echo ""
echo "🎉 Félicitations ! Votre projet BoltAI est maintenant sur GitHub !"