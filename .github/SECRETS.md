# GitHub Secrets Configuration

This document explains how to set up GitHub secrets for automated deployment.

## Required Secrets

Add these secrets to your GitHub repository settings:

### Vercel Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VERCEL_TOKEN` | Vercel API token | `vercel_xxx...` |
| `VERCEL_ORG_ID` | Vercel organization ID | `team_xxx...` |
| `VERCEL_PROJECT_ID` | Vercel project ID | `prj_xxx...` |

### Application Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `NEXTAUTH_URL` | Your app's URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | `your-super-secret-key` |
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:port/db` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |

### Optional Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-google-secret` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | `your-github-client-id` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `your-github-secret` |

## How to Add Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with its value

## Getting Vercel Credentials

### Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token
3. Copy the token value

### Vercel Org ID

1. Go to your Vercel team settings
2. Copy the Team ID from the URL or settings

### Vercel Project ID

1. Go to your project in Vercel
2. Go to Settings → General
3. Copy the Project ID

## Security Best Practices

1. **Never commit secrets to code**
2. **Use different secrets for different environments**
3. **Rotate secrets regularly**
4. **Use least privilege principle**
5. **Monitor secret usage**

## Environment-Specific Secrets

### Development
- Use `.env.local` file
- Never commit to version control

### Staging
- Use GitHub secrets
- Use staging database
- Use staging API keys

### Production
- Use GitHub secrets
- Use production database
- Use production API keys
- Enable all security features

## Troubleshooting

### Common Issues

1. **Secrets not found**
   - Check secret names match exactly
   - Ensure secrets are added to the correct repository
   - Verify secret values are correct

2. **Deployment fails**
   - Check all required secrets are set
   - Verify secret values are valid
   - Check GitHub Actions logs

3. **Authentication fails**
   - Verify OAuth credentials
   - Check redirect URIs
   - Ensure HTTPS in production

### Debug Mode

Enable debug mode in GitHub Actions:

```yaml
- name: Debug
  run: |
    echo "NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}"
    echo "DATABASE_URL: ${{ secrets.DATABASE_URL }}"
  env:
    ACTIONS_STEP_DEBUG: true
```