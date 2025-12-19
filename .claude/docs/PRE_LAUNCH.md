# GRHIIT Pre-Launch Checklist

Track all concerns and items to address before App Store release.

---

## Security

- [ ] **Re-enable `secureTextEntry` on password fields**
  - Files: `app/(auth)/login.tsx`, `app/(auth)/signup.tsx`
  - Disabled due to iOS 18 simulator crash bug
  - Must be enabled for production builds

---

## Firebase

- [ ] **Verify Firebase security rules** for Firestore
- [ ] **Enable email verification** (if required)

---

## Testing

- [ ] Test auth flow on physical device with `secureTextEntry` enabled
- [ ] Test timer accuracy on physical device
- [ ] Test background/foreground app state transitions

---

## App Store

- [ ] App icons (all sizes)
- [ ] Screenshots for App Store listing
- [ ] Privacy policy URL
- [ ] App description and keywords
