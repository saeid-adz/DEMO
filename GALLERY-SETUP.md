# Gallery Feature Setup Guide

This guide will help you set up the Photo Gallery feature that displays images from a Windows shared folder.

## Prerequisites

- Windows machine with a shared folder at `\\192.168.1.213\photos`
- SMB/CIFS credentials (username and password) for accessing the share
- K8s cluster with CIFS support

## Configuration Steps

### 1. Enable Gallery Feature

Edit `src/config/siteConfig.js`:

```javascript
gallery: {
  enabled: true,
  sharePath: '//192.168.1.213/photos'
}
```

### 2. Create SMB Credentials Secret

Option A - Using kubectl (recommended):
```bash
kubectl create secret generic smb-credentials \
  --from-literal=username=YOUR_USERNAME \
  --from-literal=password=YOUR_PASSWORD \
  -n matrix-app
```

Option B - Using the YAML file:
1. Base64 encode your credentials:
```bash
echo -n 'your-username' | base64
echo -n 'your-password' | base64
```

2. Edit `k8s/smb-secret.yaml` and replace the placeholders with your base64-encoded values

3. Apply the secret:
```bash
kubectl apply -f k8s/smb-secret.yaml
```

### 3. Update Environment Variable

After deployment, update the VITE_API_URL in your production environment to point to your LoadBalancer IP:

```bash
# Get your LoadBalancer external IP
kubectl get svc -n matrix-app

# Update .env.production with the actual IP
VITE_API_URL=http://YOUR_LOADBALANCER_IP:3001
```

### 4. Deploy the Application

```bash
# Build and push Docker image
docker build -t ghcr.io/saeid-adz/matrix-landing:latest .
docker push ghcr.io/saeid-adz/matrix-landing:latest

# Apply K8s manifests
kubectl apply -f k8s/deployment.yaml

# Verify deployment
kubectl get pods -n matrix-app
kubectl get svc -n matrix-app
```

### 5. Test the Gallery

1.  Navigate to your landing page
2. Click the "View Photo Gallery" button
3. The gallery will display all images from `\\192.168.1.213\photos`

## Local Development

For local development without K8s:

1. Mount the Windows share on your development machine
2. Update `server.js` to point to your local mount point
3. Run both servers:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend API
npm run dev:server
```

4. Access the app at `http://localhost:5173`

## Troubleshooting

### Gallery shows "Unable to connect to gallery service"

- Check if the API server is running (port 3001)
- Verify VITE_API_URL is set correctly
- Check browser console for CORS errors

### Gallery shows "Failed to read photo directory"

- Verify SMB credentials are correct
- Check if the pod can access the Windows share:
  ```bash
  kubectl exec -it <pod-name> -n matrix-app -- ls -la /mnt/photo
  ```
- Verify the Windows share allows the user to read files
- Check pod logs:
  ```bash
  kubectl logs <pod-name> -n matrix-app
  ```

### Images not loading in gallery

- Verify images have proper extensions (.jpg, .jpeg, .png, .gif, .webp, .bmp)
- Check file permissions on the Windows share
- Verify the API endpoint returns images:
  ```bash
  curl http://YOUR_LOADBALANCER_IP:3001/api/gallery
  ```

## Security Considerations

- Store SMB credentials securely using Kubernetes Secrets
- Use read-only mount for the photo share
- Consider using a dedicated service account with minimal permissions
- Implement authentication for the gallery if needed
- Use HTTPS in production (configure ingress controller)

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- BMP (.bmp)

## Features

- **Responsive Grid**: Automatically adjusts to screen size
- **Lightbox View**: Click any image to view full-size
- **Keyboard Navigation**: Use  arrow keys in lightbox mode
- **Image Count**: Displays total number of images
- **Lazy Loading**: Images load as you scroll
- **Error Handling**: Graceful fallback if share is unavailable
- **Loading States**: Visual feedback while loading images

## API Endpoints

- `GET /api/gallery` - List all images
- `GET /photos/:filename` - Serve individual image
- `GET /api/health` - Health check endpoint

## Customization

Edit the following files to customize the gallery:

- `src/components/Gallery.jsx` - Gallery component logic
- `src/components/Gallery.css` - Gallery styling
- `server.js` - Backend API configuration
- `src/config/siteConfig.js` - Enable/disable gallery

## Performance Tips

1. Optimize images on the Windows share (use compressed formats)
2. Consider adding thumbnail generation in `server.js`
3. Implement caching headers for better performance
4. Use CDN for serving images in production (optional)
