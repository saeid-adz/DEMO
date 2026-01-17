# Matrix Landing - K3s Deployment Guide

This guide will help you deploy the Matrix-style landing page to your K3s cluster.

## Prerequisites

- K3s cluster running
- kubectl configured to access your cluster
- Docker installed for building images

## Step 1: Build the Docker Image

First, navigate to the project directory and build the Docker image:

```bash
cd matrix-landing

# Build the Docker image
docker build -t matrix-landing:latest .
```

## Step 2: Load Image into K3s

K3s uses containerd, so you need to import the image:

```bash
# Save the image to a tar file
docker save matrix-landing:latest -o matrix-landing.tar

# Import to K3s (on the K3s node)
sudo k3s ctr images import matrix-landing.tar

# Or if using k3s with docker, tag and push to local registry
# Or copy the tar file to the K3s node and import there
```

**Alternative: Use K3s with Docker**
```bash
# If your K3s is configured to use Docker runtime
docker build -t matrix-landing:latest .
# The image will be available to K3s automatically
```

## Step 3: Deploy to K3s

Deploy the application using kubectl:

```bash
# Apply the Kubernetes manifests (creates namespace and deploys app)
kubectl apply -f k8s/deployment.yaml

# Verify the deployment
kubectl get deployments -n matrix-app
kubectl get pods -n matrix-app
kubectl get services -n matrix-app
kubectl get ingress -n matrix-app
```

## Step 4: Access the Application

### Option 1: Using Azure Arc LoadBalancer (Recommended for Azure Arc clusters)

The service is configured to use MetalLB LoadBalancer. After deployment, get the external IP:

```bash
kubectl get service matrix-landing-service -n matrix-app
```

Look for the `EXTERNAL-IP` assigned by MetalLB (e.g., 192.168.1.x). Access the application at:

```
http://<EXTERNAL-IP>
```

**Note:** Ensure your MetalLB IP pool has available addresses. The service uses the annotation:
```yaml
metallb.io/ip-allocated-from-pool: loadblanacer-local
```

### Option 2: Using Ingress (Alternative)

Add an entry to your hosts file:

**Windows:** `C:\Windows\System32\drivers\etc\hosts`
**Linux/Mac:** `/etc/hosts`

```
<K3S_NODE_IP> matrix.local
```

Then access the application at: `http://matrix.local`

### Option 3: Port Forward (For Testing)

```bash
kubectl port-forward service/matrix-landing-service 8080:80 -n matrix-app
```

Then access at: `http://localhost:8080`

### Option 4: NodePort (Alternative)

Modify the service in `k8s/deployment.yaml` to use NodePort:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: matrix-landing-service
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080  # Choose a port between 30000-32767
    protocol: TCP
  selector:
    app: matrix-landing
```

Apply changes and access at: `http://<K3S_NODE_IP>:30080`

## Step 5: Verify Everything is Running

```bash
# Check pod status
kubectl get pods -l app=matrix-landing -n matrix-app

# Check logs
kubectl logs -l app=matrix-landing -n matrix-app

# Describe deployment
kubectl describe deployment matrix-landing -n matrix-app

# Check service and external IP
kubectl get svc matrix-landing-service -n matrix-app
```

## Updating the Application

When you make changes to the application:

```bash
# Rebuild the image
docker build -t matrix-landing:latest .

# Reload image into K3s
docker save matrix-landing:latest -o matrix-landing.tar
sudo k3s ctr images import matrix-landing.tar

# Restart the deployment
kubectl rollout restart deployment matrix-landing -n matrix-app

# Monitor the rollout
kubectl rollout status deployment matrix-landing -n matrix-app
```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n matrix-app
kubectl logs <pod-name> -n matrix-app
```

### Image pull errors
- Ensure the image is loaded into K3s containerd
- Check imagePullPolicy is set to `IfNotPresent` or `Never`

### Ingress not working
- Ensure K3s ingress controller (Traefik) is running
- Check ingress configuration: `kubectl describe ingress matrix-landing-ingress -n matrix-app`

### Service not accessible
```bash
# Test service internally
kubectl run test-pod --rm -it --image=busybox -n matrix-app -- wget -O- http://matrix-landing-service
```

## Cleaning Up

To remove the application:

```bash
kubectl delete -f k8s/deployment.yaml
```

## Resource Limits

Current settings:
- **Replicas:** 2
- **Memory Request:** 64Mi
- **Memory Limit:** 128Mi
- **CPU Request:** 100m
- **CPU Limit:** 200m

Adjust these in `k8s/deployment.yaml` based on your needs.

## Scaling

Scale the deployment:

```bash
# Scale to 3 replicas
kubectl scale deployment matrix-landing --replicas=3 -n matrix-app

# Auto-scale (requires metrics-server)
kubectl autoscale deployment matrix-landing --min=2 --max=5 --cpu-percent=80 -n matrix-app
```
