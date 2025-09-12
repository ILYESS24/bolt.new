#!/bin/bash

echo "🚀 Ouverture du Projet BoltAI dans Cursor"
echo "========================================"
echo ""

# Vérifier si Cursor est installé
if command -v cursor &> /dev/null; then
    echo "✅ Cursor détecté !"
    echo "📁 Ouverture du projet dans Cursor..."
    cursor .
    echo "🎉 Projet ouvert dans Cursor !"
else
    echo "❌ Cursor non détecté"
    echo ""
    echo "📋 Instructions manuelles :"
    echo "1. Ouvrez Cursor"
    echo "2. File > Open Folder"
    echo "3. Naviguez vers : $(pwd)"
    echo "4. Sélectionnez ce dossier"
    echo ""
    echo "🌐 Ou téléchargez Cursor depuis : https://cursor.sh"
fi

echo ""
echo "📊 Informations du projet :"
echo "Chemin : $(pwd)"
echo "Type : Next.js + TypeScript"
echo "Taille : $(du -sh . | awk '{print $1}')"
echo ""
echo "🎯 Projet prêt pour le développement !"