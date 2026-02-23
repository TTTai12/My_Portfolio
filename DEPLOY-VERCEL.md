# Deploy lên Vercel

Dự án có 2 app: **admin-backend** (Next.js) và **frontend** (Vite). Deploy thành 2 project trên Vercel.

---

## 1. Deploy admin-backend (Next.js)

- **Root Directory**: `admin-backend`
- **Framework**: Next.js (tự nhận)
- **Environment Variables** (tab Settings → Environment Variables):

| Biến | Ví dụ | Ghi chú |
|------|--------|--------|
| `NEXTAUTH_URL` | `https://admin-xxx.vercel.app` | URL thật của project này (sau lần deploy đầu) |
| `NEXTAUTH_SECRET` | (chuỗi random) | `openssl rand -base64 32` |
| `ADMIN_USERNAME` | admin | |
| `ADMIN_PASSWORD` | (mật khẩu mạnh) | |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas |
| `CORS_ORIGIN` | `https://portfolio-xxx.vercel.app` | Domain frontend; hoặc `*` |
| `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO` | (nếu dùng email) | |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | (nếu dùng Cloudinary) | |

Sau khi deploy xong, copy **URL của admin** (vd: `https://admin-xxx.vercel.app`).

---

## 2. Deploy frontend (Vite)

- **Root Directory**: `my-portfolio` (thư mục chứa `vite.config.js`, không phải `admin-backend`)
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:

| Biến | Ví dụ | Ghi chú |
|------|--------|--------|
| `VITE_API_URL` | `https://admin-xxx.vercel.app/api` | URL admin + `/api` |
| `VITE_ADMIN_URL` | `https://admin-xxx.vercel.app/auth/login` | Link "Admin" ở footer |

---

## 3. Cập nhật NEXTAUTH_URL

Sau lần deploy admin-backend đầu tiên, vào **admin-backend** → Settings → Environment Variables → sửa `NEXTAUTH_URL` thành đúng URL Vercel (vd: `https://admin-xxx.vercel.app`) → **Redeploy**.

---

## 4. Kiểm tra

- Frontend: mở URL Vite → Projects/About/Contact hiển thị dữ liệu, form liên hệ gửi được.
- Admin: mở `VITE_ADMIN_URL` → đăng nhập → Dashboard, CRUD hoạt động.
