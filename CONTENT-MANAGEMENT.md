# Portfolio Content Management Guide

This guide explains how to manage your portfolio content dynamically.

## 📂 File Structure

```
src/
├── config/
│   └── siteConfig.js          # Enable/disable sections
├── data/
│   ├── profile.js             # Your profile information
│   ├── titles.js              # Professional titles/experience
│   └── communities.js         # Communities & certifications
└── components/
    ├── ProfileSection.jsx     # Profile component
    ├── TitlesSection.jsx      # Titles component
    └── CommunitiesSection.jsx # Communities component

public/
└── images/
    ├── profile.jpg            # Your profile photo
    └── logos/                 # Community/company logos
        ├── microsoft-mvp.png
        ├── kubernetes.png
        ├── github.png
        └── azure.png
```

## 🎛️ Configuration (src/config/siteConfig.js)

Enable or disable sections by changing `true` to `false`:

```javascript
export const siteConfig = {
  sections: {
    profile: true,      // Show/hide profile section
    titles: true,       // Show/hide experience section
    communities: true,  // Show/hide communities section
    banner: true        // Show/hide welcome banner
  },
  animation: {
    matrixRain: true,   // Show/hide matrix background
    fadeInDelay: 500    // Animation delay in ms
  }
};
```

## 👤 Profile Data (src/data/profile.js)

Update your personal information:

```javascript
export const profileData = {
  name: "Your Name",
  tagline: "Your Professional Title",
  image: "/images/profile.jpg",
  bio: "Your bio description",
  contact: {
    email: "your.email@example.com",
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourusername",
    website: "https://yourwebsite.com"
  }
};
```

**Note:** Place your profile photo at `public/images/profile.jpg`

## 💼 Professional Titles (src/data/titles.js)

Add or modify your work experience:

```javascript
export const titlesData = [
  {
    id: 1,
    title: "Job Title",
    company: "Company Name",
    period: "2020 - Present",
    description: "What you did in this role"
  },
  // Add more entries...
];
```

## 🏆 Communities & Certifications (src/data/communities.js)

Add your communities, certifications, or affiliations:

```javascript
export const communitiesData = [
  {
    id: 1,
    name: "Community Name",
    logo: "/images/logos/logo.png",
    title: "Your Role/Title",
    description: "Brief description",
    link: "https://community-url.com"
  },
  // Add more entries...
];
```

**Note:** Place logos in `public/images/logos/`

## 🖼️ Adding Images

### Profile Photo:
1. Add your photo to: `public/images/profile.jpg`
2. Recommended size: 500x500px (square)
3. Formats: JPG, PNG, or WEBP

### Community/Company Logos:
1. Add logos to: `public/images/logos/`
2. Use transparent PNG for best results
3. Recommended size: 200x200px

## 🚀 Quick Update Workflow

1. **Edit Data Files:**
   ```bash
   # Edit your information
   code src/data/profile.js
   code src/data/titles.js
   code src/data/communities.js
   ```

2. **Add Images:**
   ```bash
   # Copy your profile photo
   cp /path/to/your-photo.jpg public/images/profile.jpg
   
   # Copy logos
   cp /path/to/logo.png public/images/logos/
   ```

3. **Toggle Sections (Optional):**
   ```bash
   # Enable/disable sections
   code src/config/siteConfig.js
   ```

4. **Build & Deploy:**
   ```bash
   # Build new Docker image
   docker build -t ghcr.io/saeid-adz/matrix-landing:latest .
   
   # Push to registry
   docker push ghcr.io/saeid-adz/matrix-landing:latest
   
   # Commit changes
   git add .
   git commit -m "Update portfolio content"
   git push origin main
   ```

## 🎨 Customization Tips

### Change Colors:
Edit `src/config/siteConfig.js`:
```javascript
theme: {
  primaryColor: '#00ff41',  // Change to your preferred color
  backgroundColor: '#000'
}
```

### Disable Matrix Background:
```javascript
animation: {
  matrixRain: false  // No more matrix rain
}
```

### Hide Sections:
```javascript
sections: {
  profile: true,
  titles: false,      // Hide experience section
  communities: true,
  banner: false       // Hide welcome banner
}
```

## 📝 Example Updates

### Adding a New Job:
```javascript
// In src/data/titles.js
{
  id: 4,
  title: "New Position",
  company: "New Company",
  period: "2024 - Present",
  description: "Exciting new role description"
}
```

### Adding a New Certification:
```javascript
// In src/data/communities.js
{
  id: 5,
  name: "AWS",
  logo: "/images/logos/aws.png",
  title: "Solutions Architect",
  description: "AWS Certified Solutions Architect",
  link: "https://aws.amazon.com/certification/"
}
```

## 🔄 GitOps Automatic Deployment

Once you push changes to GitHub, your app automatically deploys to Kubernetes!

Watch deployment:
```bash
kubectl get pods -n matrix-app --watch
```

Check status:
```bash
kubectl get svc matrix-landing-service -n matrix-app
```

## 🆘 Troubleshooting

**Images not showing?**
- Check file path in data files
- Ensure images are in `public/images/` folder
- Clear browser cache (Ctrl+F5)

**Section not appearing?**
- Check `siteConfig.js` - is it enabled?
- Verify data file has content
- Check browser console for errors

**Old content showing?**
- Rebuild Docker image
- Push to registry
- Restart pods: `kubectl rollout restart deployment matrix-landing -n matrix-app`

---

💡 **Pro Tip:** Keep your data files up to date and commit changes regularly. Your portfolio will always reflect your latest achievements!
