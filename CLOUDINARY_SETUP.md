# Cloudinary Setup Instructions

## Step 1: Create Upload Preset

You need to create an **unsigned upload preset** to allow uploads from the browser without signing each request.

### Instructions:

1. Go to Cloudinary Dashboard: https://cloudinary.com/console
2. Click **Settings** (gear icon) → **Upload** tab
3. Scroll to **Upload presets** section
4. Click **Add upload preset**
5. Configure:
   - **Upload preset name**: `portfolio_preset`
   - **Signing Mode**: **Unsigned** (IMPORTANT!)
   - **Folder**: `portfolio` (optional but recommended)
   - **Format**: Leave empty (auto-detect)
   - **Allowed formats**: `jpg, png, gif, webp`
6. Click **Save**

## Step 2: Verify Configuration

Your `.env.local` should have:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvfbzhr11
CLOUDINARY_API_KEY=884655163785863
CLOUDINARY_API_SECRET=DgxYRNeD4s75-vRHkNyYrY3HE84
```

✅ **DONE!** Your upload widget is ready to use.

## Test Upload

1. Start dev server: `npm run dev` (in admin-backend folder)
2. Go to: http://localhost:3000/about/new
3. Scroll to "Avatar" section
4. Click upload → Select image → Should upload to Cloudinary

## Troubleshooting

**Error: "Upload preset must be unsigned"**

- Make sure you set **Signing Mode** to **Unsigned** in Cloudinary preset settings

**Error: "Invalid cloud name"**

- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches your dashboard

**Image not showing after upload**

- Check browser console for errors
- Verify the returned URL is accessible
