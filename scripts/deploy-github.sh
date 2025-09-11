#!/bin/bash

# Script de déploiement GitHub pour BoltAI
set -e

echo "🚀 Déploiement de BoltAI sur GitHub..."

# Vérifier si nous sommes dans un repository Git
if [ ! -d ".git" ]; then
    echo "❌ Ce n'est pas un repository Git. Initialisation..."
    git init
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

# Ajouter tous les fichiers
echo "📝 Ajout des fichiers..."
git add .

# Créer le commit initial
echo "💾 Création du commit initial..."
git commit -m "🚀 Initial commit: BoltAI - AI-Powered Code Generator

✨ Features:
- 🤖 AI-powered code generation with OpenAI GPT-4
- 💻 Monaco Editor with syntax highlighting
- 📁 Multi-file project management
- 🖥️ Integrated terminal
- 🔐 Authentication with NextAuth.js
- 📊 Dashboard with project management
- 🌐 Public/private project sharing
- 📱 Responsive design with TailwindCSS
- 🎨 Modern UI with Framer Motion animations

🚀 Deployment ready:
- ✅ Vercel configuration
- ✅ Railway configuration  
- ✅ Render configuration
- ✅ Docker support
- ✅ Multi-database support (SQLite/PostgreSQL/MySQL)
- ✅ Environment configuration
- ✅ CI/CD with GitHub Actions
- ✅ Health checks and monitoring
- ✅ Security headers and middleware

📚 Documentation:
- Complete deployment guides
- Database setup instructions
- Environment configuration
- Cloud provider comparisons
- Quick start guide"

# Pousser vers GitHub
echo "⬆️  Poussage vers GitHub..."
git push -u origin main

# Créer les badges de déploiement
echo "🏷️  Création des badges de déploiement..."
cat > DEPLOYMENT_BADGES.md << EOF
# 🚀 Badges de déploiement

Ajoutez ces badges à votre README.md :

## Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/$GITHUB_USERNAME/$REPO_NAME)

## Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/$REPO_NAME)

## Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/$GITHUB_USERNAME/$REPO_NAME)

## Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/$GITHUB_USERNAME/$REPO_NAME)
EOF

# Afficher les informations de déploiement
echo ""
echo "✅ Déploiement terminé avec succès !"
echo ""
echo "📋 Informations du repository:"
echo "   URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "   Clone: git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Allez sur https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "   2. Ajoutez les badges de déploiement à votre README.md"
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
echo "🎉 Félicitations ! Votre projet BoltAI est maintenant sur GitHub !"