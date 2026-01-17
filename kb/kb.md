Design a single-page React application that visually recreates a professional personal branding banner with a dark, modern Microsoft/Azure aesthetic. The layout must be pixel-precise, clean, and production-ready.

1. Canvas & General Layout

Full-width responsive container (desktop-first, minimum width 1280px)

Aspect ratio similar to a wide banner (16:9 or wider)

Background color: very dark navy / near-black (#0B0F1A or similar)

Subtle dotted or star-grid pattern across the entire background:

Small dots

Low opacity (5–8%)

Evenly spaced

Non-distracting

Use CSS Grid or Flexbox with two main columns:

Left column: 45% width

Right column: 55% width

Vertical alignment: center content within the viewport height.

2. Left Column – Text, QR Code, and Community Branding
Name & Role (Top Left)

Large heading text:

Text: “Saeid Dahl”

Font size: ~48–56px

Font weight: 600–700

Color: white

Subtitle directly underneath:

Text: “Azure and AI Leader at Upheads”

Font size: ~20–22px

Font weight: 400–500

Color: light gray (#C9CDD6)

Emphasize “Upheads” with slightly brighter white

Use a modern sans-serif font (Inter, Segoe UI, or similar).

Professional Titles Section

Below the role, list credentials as stacked lines:

“Microsoft Azure MVP”

“Microsoft MCT”

“Microsoft Learn Expert”

Styling:

Font size: ~18px

Color: white

Line spacing: comfortable, not tight

No icons, clean text-only layout

Community Leadership Text

Text block below credentials:

Line 1 (smaller):

“Board member and community leader of:”

Line 2:

“Microsoft Hero, MSFarsi and Global Azure”

Styling:

Font size: ~16–18px

Color: light gray

“MSFarsi” may have subtle underline or highlight

QR Code (Lower Left)

Square QR code container

Size: ~160–180px

White background with black QR code

Positioned below the text blocks, aligned left

Slight padding and clean edges

No heavy border

Community Logos (Bottom Left)

Place three logos horizontally, aligned near the QR code:

Microsoft Hero

MSFarsi Community

Global Azure

Styling:

Logos scaled evenly

White or brand-colored versions

Subtle spacing between logos

No drop shadows

3. Right Column – Profile Image & Visual Accents
Profile Image Container

Large rounded rectangle or soft circular frame

Width: ~420–480px

Height proportional to portrait

Border radius: very high (almost pill-shaped)

Inside:

Professional portrait photo

Centered

Slight background blur behind subject

Neon Glow Effect Around Image

Add a glowing outline behind the image frame:

Gradient colors:

Purple → Pink → Blue

Glow spread: soft, not sharp

Opacity: medium (visible but not overpowering)

Implement via:

Pseudo-element (::before)

Or absolute-positioned gradient div with blur filter

Decorative Tech Accents

Top-right corner of the image area:

Diagonal short lines or bars

Gradient color (pink/purple)

Thin, modern, decorative only

Low opacity

4. Certification Badges (Bottom Right)

Position below the portrait image:

Two circular badges:

Microsoft MVP badge

Microsoft Certified Trainer (MCT) badge

Styling:

High-resolution images

Placed side-by-side

Slight spacing

No extra effects beyond natural logo styling

5. Color Palette Summary

Background: #0B0F1A (near-black)

Primary text: #FFFFFF

Secondary text: #C9CDD6

Accent gradients:

Purple (#7B3FE4)

Pink (#E845B5)

Blue (#3A7BFF)

6. Technical Requirements

React functional components

Tailwind CSS or CSS Modules preferred

No inline styles

Responsive scaling (desktop → tablet)

No animations required (static design)

Clean semantic HTML structure

Accessibility:

Alt text for images

Proper heading hierarchy

7. Overall Design Intent

The final UI must communicate:

Senior Azure & AI leadership

Microsoft ecosystem credibility

Community leadership

Modern, cloud-first, AI-focused professionalism

Approachable and confident personal brand

The design should feel suitable for:

Conference speaker slides

Professional landing pages

LinkedIn banner adaptation

Tech community promotions