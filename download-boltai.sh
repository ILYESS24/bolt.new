#!/bin/bash

echo "🚀 Script de Téléchargement BoltAI"
echo "=================================="
echo ""

# Vérifier si le fichier ZIP existe
if [ -f "boltai-complete-project.zip" ]; then
    echo "✅ Fichier ZIP trouvé !"
    echo "📁 Taille: $(ls -lh boltai-complete-project.zip | awk '{print $5}')"
    echo "📊 Fichiers: $(unzip -l boltai-complete-project.zip | wc -l)"
    echo ""
    
    echo "📥 Options de téléchargement :"
    echo "1. Copier le fichier vers votre dossier de téléchargements"
    echo "2. Afficher le contenu en base64"
    echo "3. Créer un lien de partage"
    echo ""
    
    read -p "Choisissez une option (1-3): " choice
    
    case $choice in
        1)
            echo "📋 Copie du fichier..."
            cp boltai-complete-project.zip ~/Downloads/ 2>/dev/null || cp boltai-complete-project.zip ~/Desktop/ 2>/dev/null || echo "⚠️  Veuillez copier manuellement le fichier"
            echo "✅ Fichier copié !"
            ;;
        2)
            echo "📄 Contenu base64 :"
            echo "=================="
            base64 boltai-complete-project.zip
            echo ""
            echo "💡 Pour décoder : base64 -d > boltai-complete-project.zip"
            ;;
        3)
            echo "🔗 Création d'un lien de partage..."
            # Créer un serveur temporaire
            echo "Serveur démarré sur le port 8080"
            echo "Lien: http://localhost:8080/boltai-complete-project.zip"
            python3 -m http.server 8080
            ;;
        *)
            echo "❌ Option invalide"
            ;;
    esac
else
    echo "❌ Fichier ZIP non trouvé !"
    echo "Vérifiez que vous êtes dans le bon répertoire"
fi

echo ""
echo "🎉 Script terminé !"