# Azure Arc GitOps Setup Guide

This guide will walk you through setting up GitOps with Flux v2 to deploy the Matrix Landing application from your private GitHub repository to your Azure Arc-enabled K3s cluster.

## Prerequisites

- Azure Arc-enabled K3s cluster connected to Azure
- Azure CLI installed and logged in
- Private GitHub repository with your Matrix landing code
- kubectl configured to access your cluster
- Appropriate permissions on your Azure subscription

## Step 1: Prepare Your GitHub Repository

### Option A: Using SSH Authentication (Recommended)

#### 1.1 Generate SSH Key Pair

On your local machine:

```powershell
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "gitops@matrix-landing" -f ~/.ssh/matrix-landing-gitops

# Display the public key
Get-Content ~/.ssh/matrix-landing-gitops.pub
```

#### 1.2 Add SSH Key to GitHub

1. Copy the public key output from above
2. Go to your GitHub repository: **Settings** → **Deploy keys**
3. Click **Add deploy key**
4. **Title**: `Azure Arc GitOps - Matrix Landing`
5. **Key**: Paste your public key
6. Check **Allow write access** (only if you plan to use image automation)
7. Click **Add key**

### Option B: Using Personal Access Token (PAT)

#### 1.1 Create GitHub Personal Access Token

1. Go to GitHub: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. **Note**: `Azure Arc GitOps - Matrix Landing`
4. **Expiration**: Choose appropriate expiration
5. **Scopes**: Select:
   - `repo` (Full control of private repositories)
6. Click **Generate token**
7. **Copy the token immediately** (you won't see it again!)

## Step 2: Get Your Cluster Information

```powershell
# List your Azure Arc-enabled clusters
az connectedk8s list --output table

# Get your cluster details
$RESOURCE_GROUP = "your-resource-group-name"
$CLUSTER_NAME = "your-cluster-name"
$SUBSCRIPTION = "your-subscription-id"

# Verify cluster connection
az connectedk8s show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME
```

## Step 3: Install Flux Extension on Your Cluster

Install the Flux extension if it's not already installed:

```powershell
# Check if Flux extension exists
az k8s-extension list `
  --cluster-name $CLUSTER_NAME `
  --resource-group $RESOURCE_GROUP `
  --cluster-type connectedClusters

# Install Flux extension (if not already installed)
az k8s-extension create `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --extension-type microsoft.flux `
  --name flux
```

## Step 4: Create Flux Configuration with SSH Authentication

### Option A: SSH with User-Provided Keys

```powershell
# Read your private key and convert to base64
$privateKeyPath = "$env:USERPROFILE\.ssh\matrix-landing-gitops"
$privateKeyContent = Get-Content $privateKeyPath -Raw
$privateKeyBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($privateKeyContent))

# Your GitHub repository URL (SSH format)
$REPO_URL = "git@github.com:your-username/your-repo-name.git"

# Create Flux configuration
az k8s-configuration flux create `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name matrix-landing-gitops `
  --namespace flux-config `
  --scope cluster `
  --url $REPO_URL `
  --branch main `
  --ssh-private-key $privateKeyBase64 `
  --kustomization name=matrix-app prune=true path=./k8s
```

### Option B: HTTPS with Personal Access Token

```powershell
# Your GitHub repository URL (HTTPS format)
$REPO_URL = "https://github.com/your-username/your-repo-name.git"
$GITHUB_USER = "your-github-username"
$GITHUB_PAT = "your-personal-access-token"

# Create Flux configuration
az k8s-configuration flux create `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name matrix-landing-gitops `
  --namespace flux-config `
  --scope cluster `
  --url $REPO_URL `
  --branch main `
  --https-user $GITHUB_USER `
  --https-key $GITHUB_PAT `
  --kustomization name=matrix-app prune=true path=./k8s
```

### Option C: Using Local Kubernetes Secret (Advanced)

This method is useful if you want to manage credentials separately:

```powershell
# For SSH authentication
kubectl create namespace flux-config
kubectl create secret generic matrix-landing-auth `
  -n flux-config `
  --from-file=identity=$env:USERPROFILE\.ssh\matrix-landing-gitops `
  --from-file=known_hosts=$env:USERPROFILE\.ssh\known_hosts

# Create Flux configuration using the local secret
az k8s-configuration flux create `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name matrix-landing-gitops `
  --namespace flux-config `
  --scope cluster `
  --url $REPO_URL `
  --branch main `
  --local-auth-ref matrix-landing-auth `
  --kustomization name=matrix-app prune=true path=./k8s
```

## Step 5: Verify Flux Configuration

### Check Configuration Status

```powershell
# Check Flux configuration status
az k8s-configuration flux show `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name matrix-landing-gitops

# Check compliance state (wait for "Compliant")
az k8s-configuration flux show `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name matrix-landing-gitops `
  --query "{name:name, compliance:complianceState, status:provisioningState}"
```

### Verify Flux Pods

```powershell
# Check Flux system pods
kubectl get pods -n flux-system

# Check Flux configuration namespace
kubectl get pods -n flux-config

# Check GitRepository resource
kubectl get gitrepositories -n flux-config

# Check Kustomization resource
kubectl get kustomizations -n flux-config
```

## Step 6: Verify Application Deployment

```powershell
# Check if matrix-app namespace was created
kubectl get namespaces

# Check deployment in matrix-app namespace
kubectl get all -n matrix-app

# Check the LoadBalancer service
kubectl get svc matrix-landing-service -n matrix-app

# Get the external IP
kubectl get svc matrix-landing-service -n matrix-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

## Step 7: Monitor Flux Reconciliation

```powershell
# Watch Flux reconciliation
kubectl get gitrepositories -n flux-config --watch

# Check Flux logs
kubectl logs -n flux-system -l app=source-controller --tail=50
kubectl logs -n flux-system -l app=kustomize-controller --tail=50

# Describe the GitRepository to see any issues
kubectl describe gitrepository -n flux-config matrix-landing-gitops

# Describe the Kustomization
kubectl describe kustomization -n flux-config matrix-app
```

## Step 8: View in Azure Portal

1. Navigate to **Azure Portal**
2. Go to your **Resource Group** → Your **Azure Arc-enabled Kubernetes cluster**
3. In the left menu, under **Settings**, select **GitOps**
4. You should see your `matrix-landing-gitops` configuration
5. Click on it to see details, compliance state, and sync status

## Updating Your Application

Once GitOps is set up, updates are automatic:

1. **Make changes to your code locally**
2. **Commit and push to GitHub:**
   ```powershell
   git add .
   git commit -m "Updated Matrix landing page"
   git push origin main
   ```
3. **Flux automatically syncs (default: every 1 minute)**
4. **Watch the deployment update:**
   ```powershell
   kubectl get pods -n matrix-app --watch
   ```

## Troubleshooting

### Configuration Showing as Non-Compliant

```powershell
# Check GitRepository status
kubectl describe gitrepository -n flux-config matrix-landing-gitops

# Check for authentication issues
kubectl get events -n flux-config --sort-by='.lastTimestamp'

# View Flux controller logs
kubectl logs -n flux-system -l app=source-controller
kubectl logs -n flux-system -l app=kustomize-controller
```

### SSH Authentication Issues

```powershell
# Verify your SSH key is in PEM format and includes newline
Get-Content ~/.ssh/matrix-landing-gitops

# Regenerate if needed with proper format
ssh-keygen -t rsa -b 4096 -m PEM -C "gitops@matrix-landing" -f ~/.ssh/matrix-landing-gitops
```

### HTTPS Authentication Issues

- Verify your PAT hasn't expired
- Ensure PAT has correct permissions (`repo` scope)
- Check if PAT is base64 encoded correctly

### Force Reconciliation

```powershell
# Force Flux to reconcile immediately
kubectl annotate gitrepository matrix-landing-gitops -n flux-config reconcile.fluxcd.io/requestedAt="$(date +%s)" --overwrite

# Or patch the GitRepository
kubectl patch gitrepository matrix-landing-gitops -n flux-config -p '{"spec":{"interval":"30s"}}' --type=merge
```

## Advanced Configuration

### Change Sync Interval

```powershell
# Update to sync every 30 seconds
az k8s-configuration flux update `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name matrix-landing-gitops `
  --kustomization name=matrix-app interval=30s
```

### Add Multiple Kustomizations

```powershell
# Add a second kustomization for production environment
az k8s-configuration flux kustomization create `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name matrix-landing-gitops `
  --kustomization-name production `
  --path ./k8s/production `
  --prune true `
  --depends-on matrix-app
```

### Namespace-Scoped Configuration

If you want to limit permissions to only the `matrix-app` namespace:

```powershell
az k8s-configuration flux create `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name matrix-landing-gitops `
  --namespace matrix-app `
  --scope namespace `
  --url $REPO_URL `
  --branch main `
  --ssh-private-key $privateKeyBase64 `
  --kustomization name=matrix-app prune=true path=./k8s
```

## Clean Up

To remove the GitOps configuration:

```powershell
# Delete Flux configuration
az k8s-configuration flux delete `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name matrix-landing-gitops `
  --yes

# Optional: Delete the Flux extension
az k8s-extension delete `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --name flux `
  --yes
```

## Benefits of GitOps

✅ **Automated Deployment**: Push to Git, and Flux automatically deploys
✅ **Version Control**: All changes tracked in Git
✅ **Rollback**: Easy rollback by reverting Git commits
✅ **Consistency**: Same deployment process across all environments
✅ **Audit Trail**: Complete history of who changed what and when
✅ **Disaster Recovery**: Cluster can be recreated from Git repository

## Next Steps

1. Set up different branches for dev/staging/production
2. Implement image automation to update image tags automatically
3. Add Helm releases for more complex deployments
4. Configure notifications (Slack, Teams, etc.)
5. Set up Azure Policy for GitOps at scale across multiple clusters

## References

- [Azure Arc GitOps Documentation](https://learn.microsoft.com/en-us/azure/azure-arc/kubernetes/conceptual-gitops-flux2)
- [Flux v2 Documentation](https://fluxcd.io/docs/)
- [GitHub SSH Keys Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
