# Frontend - Booking Lapangan Bola

Frontend web application untuk sistem booking lapangan bola menggunakan Next.js 14, TypeScript, dan Tailwind CSS.

## 📁 Struktur Frontend

```
src/
├── app/                          # Next.js App Router pages
│   ├── auth/                    # Auth pages
│   │   ├── login/              # Halaman login
│   │   └── register/           # Halaman register
│   ├── lapangan/               # Lapangan pages
│   │   ├── [id]/              # Detail lapangan & booking form
│   │   └── page.tsx           # List lapangan
│   ├── booking/                # Booking pages
│   │   ├── [id]/              # Detail booking
│   │   └── page.tsx           # List booking user
│   ├── dashboard/              # Dashboard pages
│   │   ├── profile/           # Edit profile
│   │   └── page.tsx           # Dashboard utama
│   ├── layout.tsx              # Root layout dengan AuthProvider & Navbar
│   └── page.tsx                # Homepage
│
├── components/                  # Reusable components
│   └── ui/                     # UI components
│       ├── Button.tsx          # Button dengan variant & loading state
│       ├── Card.tsx            # Card container
│       ├── Input.tsx           # Input dengan label & error
│       ├── Modal.tsx           # Modal dialog
│       └── Navbar.tsx          # Navigation bar
│
├── contexts/                    # React contexts
│   └── AuthContext.tsx         # Auth state management
│
├── lib/                         # Libraries & utilities
│   └── api/                    # API client
│       └── client.ts           # API functions untuk semua endpoints
│
└── types/                       # TypeScript types (shared dengan backend)
    └── index.ts
```

## 🎨 Komponen UI

### Button

```tsx
<Button
  variant="primary|secondary|danger|outline"
  size="sm|md|lg"
  isLoading={boolean}
>
  Click Me
</Button>
```

### Input

```tsx
<Input label="Email" type="email" error={errorMessage} />
```

### Card

```tsx
<Card onClick={handleClick}>Content here</Card>
```

### Modal

```tsx
<Modal isOpen={true} onClose={handleClose} title="Modal Title">
  Content here
</Modal>
```

## 🔐 Authentication Flow

1. **Register** → `/auth/register`
   - Input: email, nama, password, no_hp
   - Output: Token disimpan di localStorage
2. **Login** → `/auth/login`

   - Input: email, password
   - Output: Token disimpan di localStorage

3. **AuthContext**
   - Mengelola user state global
   - Auto-load user saat mount
   - Provide: `user`, `login`, `register`, `logout`

## 📱 Halaman Frontend

### Public Pages

- **Homepage** (`/`) - Hero section & features
- **List Lapangan** (`/lapangan`) - Browse & search lapangan
- **Detail Lapangan** (`/lapangan/[id]`) - Detail & form booking

### Protected Pages (Require Login)

- **Dashboard** (`/dashboard`) - Overview & quick actions
- **Booking Saya** (`/booking`) - List booking dengan filter
- **Detail Booking** (`/booking/[id]`) - Detail & cancel booking
- **Edit Profile** (`/dashboard/profile`) - Update nama & no_hp

## 🔌 API Client

Semua API calls ada di `src/lib/api/client.ts`:

```typescript
// Auth
authAPI.register(data);
authAPI.login(email, password);
authAPI.me();
authAPI.logout();

// Lapangan
lapanganAPI.getAll(filters);
lapanganAPI.getById(id);
lapanganAPI.create(data); // Admin only
lapanganAPI.update(id, data); // Admin only
lapanganAPI.delete(id); // Admin only

// Booking
bookingAPI.checkAvailability(data);
bookingAPI.getAll(filters);
bookingAPI.getById(id);
bookingAPI.create(data);
bookingAPI.cancel(id);

// User
userAPI.getProfile();
userAPI.updateProfile(data);
userAPI.getHistory();
```

## 🎯 Fitur Utama

### 1. Browse & Search Lapangan

- List semua lapangan aktif
- Search by nama
- Tampilan card dengan info harga & fasilitas

### 2. Booking System

- Form booking dengan date & time picker
- Check availability sebelum booking
- Auto calculate total harga
- Cancel booking (status pending only)

### 3. User Management

- Register & Login
- Dashboard dengan quick actions
- Edit profile
- Riwayat booking dengan filter status

### 4. Responsive Design

- Mobile-first approach
- Tailwind CSS utility classes
- Grid & flexbox layouts

## 🚀 Development

```bash
# Install dependencies
npm install

# Setup database (jika belum)
npm run db:migrate
npm run db:seed

# Run development server
npm run dev
```

Akses aplikasi di: `http://localhost:3000`

## 📝 Sample User Accounts

Setelah run `npm run db:seed`:

**Admin:**

- Email: admin@lapangan.com
- Password: password123

**User:**

- Email: user@example.com
- Password: password123

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Color Palette**:
  - Primary: Blue (600, 700)
  - Secondary: Gray
  - Success: Green
  - Warning: Yellow
  - Danger: Red

## 📦 Dependencies

- **next**: ^14.2.0 - React framework
- **react**: ^18.3.0 - UI library
- **typescript**: ^5 - Type safety
- **tailwindcss**: ^3.4.1 - CSS framework

## 🔒 Security Features

- JWT token stored in localStorage
- Authorization header di setiap API call
- Protected routes redirect ke login
- Role-based access control (User/Admin)

## 📱 User Experience

- Loading states di semua async operations
- Error handling dengan messages yang jelas
- Success notifications
- Responsive & mobile-friendly
- Intuitive navigation

## 🎯 Next Steps

Fitur yang bisa ditambahkan:

- [ ] Image upload untuk lapangan
- [ ] Payment integration
- [ ] Real-time availability calendar
- [ ] Rating & review system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Push notifications

---

**Created with ❤️ using Next.js 14 & TypeScript**
