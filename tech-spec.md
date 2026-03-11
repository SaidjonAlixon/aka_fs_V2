# AKA FS Logistics - Technical Specification

## 1. Component Inventory

### shadcn/ui Components (Built-in)
| Component | Purpose | Customization |
|-----------|---------|---------------|
| Button | CTAs, form submissions | Custom neon lime variant |
| Card | Service cards, testimonials | Glassmorphism styling |
| Input | Contact forms | Neon focus border |
| Textarea | Message fields | Matching input styling |
| Accordion | FAQ section | Custom chevron animation |
| Dialog | Mobile menu | Full-screen variant |
| Label | Form labels | Mono font styling |
| Separator | Visual dividers | 1px hairline |

### Third-Party Registry Components
None required - all effects will be custom-built with GSAP for precise control.

### Custom Components
| Component | Purpose | Props |
|-----------|---------|-------|
| `SlashBars` | Diagonal decorative bars | position: 'left' \| 'right', variant: 'navy' \| 'lime' |
| `GrainOverlay` | Film grain texture | opacity: number |
| `AnimatedHeadline` | Character-by-character reveal | text: string, delay?: number |
| `GlassCard` | Glassmorphism card wrapper | children, hover?: boolean |
| `StatCounter` | Animated number counter | value: number, suffix?: string |
| `ScrollReveal` | Scroll-triggered reveal wrapper | children, direction: 'left' \| 'right' \| 'up' |
| `PinnedSection` | Full-viewport pinned section | children, id: string |
| `Navigation` | Fixed header with theme toggle | - |
| `MobileMenu` | Full-screen mobile navigation | isOpen, onClose |

---

## 2. Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| **Hero load animation** | GSAP | Timeline with staggered character reveal, background scale, slash bars slide | High |
| **Hero scroll exit** | GSAP ScrollTrigger | scrub: 0.6, fromTo transforms, opacity fade at 92-98% | Medium |
| **Pinned section entrances** | GSAP ScrollTrigger | 3-phase: 0-30% entrance, 30-70% settle, 70-100% exit | High |
| **Headline character reveal** | GSAP SplitText (or custom) | Split by chars, stagger 0.02s, y: 24→0, opacity 0→1 | Medium |
| **Slash bars slide** | GSAP ScrollTrigger | skewX(-22deg), x: ±30vw→0, scrubbed | Low |
| **Service list stagger** | GSAP ScrollTrigger | timeline with stagger 0.08 per item | Medium |
| **Stats counter** | GSAP | animate number from 0 to target over 2s with easeOut | Low |
| **Card hover lift** | CSS/Framer Motion | transform: translateY(-4px), transition 0.2s | Low |
| **Accordion expand** | GSAP | height: 0→auto, chevron rotation, 0.25s | Low |
| **Testimonial cards reveal** | GSAP ScrollTrigger | scrubbed, y: 40→0, opacity 0→1, stagger 0.12 | Medium |
| **Form field focus** | CSS | border-color transition to neon lime | Low |
| **Button hover** | CSS | translateY(-2px), scale(1.02) | Low |
| **Ambient floating** | GSAP | y: ±6px loop during settle phase | Low |
| **Global scroll snap** | GSAP ScrollTrigger | snap to pinned section centers only | High |

---

## 3. Animation Library Choices

### Primary: GSAP + ScrollTrigger
**Rationale:**
- Best-in-class scroll-linked animations with `scrub`
- Precise timeline control for 3-phase pinned sections
- Reverse scroll works correctly with `fromTo()`
- Excellent performance with transform-only animations

### Secondary: CSS Transitions
**Use for:**
- Button hover states
- Input focus states
- Simple opacity/transform transitions

### Optional: GSAP SplitText (or custom splitter)
**Use for:**
- Headline character-by-character reveals
- If SplitText not available, implement custom character splitter

---

## 4. Project File Structure

```
app/
├── public/
│   ├── images/
│   │   ├── hero_highway_night.jpg
│   │   ├── services_warehouse.jpg
│   │   ├── coverage_interchange.jpg
│   │   ├── fleet_truck_motion.jpg
│   │   ├── industries_reefer_night.jpg
│   │   ├── tech_dashboard.jpg
│   │   ├── safety_wet_road.jpg
│   │   ├── sustainability_scenic.jpg
│   │   ├── careers_driver_cab.jpg
│   │   └── contact_truck_road.jpg
│   └── grain.png
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── label.tsx
│   │   │   └── separator.tsx
│   │   ├── SlashBars.tsx
│   │   ├── GrainOverlay.tsx
│   │   ├── AnimatedHeadline.tsx
│   │   ├── GlassCard.tsx
│   │   ├── StatCounter.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── PinnedSection.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Coverage.tsx
│   │   ├── Fleet.tsx
│   │   ├── Industries.tsx
│   │   ├── Technology.tsx
│   │   ├── Safety.tsx
│   │   ├── Sustainability.tsx
│   │   ├── Careers.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   ├── useScrollProgress.ts
│   │   ├── useInView.ts
│   │   └── useMediaQuery.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── animations.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Dependencies to Install

### Core (via init script)
- React 18+
- TypeScript
- Vite
- Tailwind CSS 3.4+
- shadcn/ui base

### Animation Libraries
```bash
npm install gsap @gsap/react
```

### Fonts (Google Fonts via CDN)
- Space Grotesk (headings)
- Inter (body)
- IBM Plex Mono (labels)

### shadcn Components to Add
```bash
npx shadcn add button card input textarea accordion dialog label separator
```

---

## 6. Key Technical Decisions

### Pinned Section Architecture
```typescript
// Each pinned section follows this pattern:
const sectionTrigger = {
  trigger: sectionRef.current,
  start: "top top",
  end: "+=130%",
  pin: true,
  scrub: 0.6,
  onLeaveBack: () => {
    // Reset to visible state when scrolling back
  }
};
```

### Z-Index Stacking
- Section 1 (Hero): z-index: 10
- Section 2: z-index: 20
- ...
- Section 9: z-index: 90
- Flowing sections: z-index: 5 (below pinned)

### Scroll Snap Implementation
```typescript
// Global snap that only affects pinned sections
ScrollTrigger.create({
  snap: {
    snapTo: (progress) => {
      // Calculate nearest pinned section center
      // Return snap target
    },
    duration: { min: 0.18, max: 0.55 },
    delay: 0,
    ease: "power2.out"
  }
});
```

### Performance Optimizations
- Use `will-change: transform` on animated elements
- Lazy load images below fold
- Use `transform` and `opacity` only (no blur/filter)
- Implement `prefers-reduced-motion` media query

---

## 7. Color Tokens (Tailwind Config)

```javascript
// tailwind.config.ts
colors: {
  background: {
    primary: '#070B14',
    secondary: '#0E1626',
  },
  accent: '#B8FF2C',
  text: {
    primary: '#F2F5FA',
    secondary: '#A7B1C6',
  },
}
```

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Desktop | 1440px+ | Full experience |
| Laptop | 1024px | Reduced type sizes |
| Tablet | 768px | Stack columns |
| Mobile | 480px | Single column, simplified motion |

---

## 9. Animation Timing Reference

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Character reveal | 1.2s total | power2.out |
| Section entrance | 30% of scroll | none (scrubbed) |
| Section exit | 30% of scroll | none (scrubbed) |
| Button hover | 0.2s | ease-out |
| Accordion expand | 0.25s | power2.out |
| Ambient float | 3.5s loop | sine.inOut |
| Counter animation | 2s | power2.out |

---

## 10. Implementation Checklist

### Phase 1: Setup
- [ ] Initialize project with webapp-building skill
- [ ] Install GSAP and shadcn components
- [ ] Set up Tailwind config with custom colors
- [ ] Add Google Fonts

### Phase 2: Core Components
- [ ] Build SlashBars component
- [ ] Build GrainOverlay component
- [ ] Build AnimatedHeadline component
- [ ] Build GlassCard component
- [ ] Build Navigation component

### Phase 3: Pinned Sections (1-9)
- [ ] Hero section with load animation
- [ ] Services section
- [ ] Coverage section
- [ ] Fleet section
- [ ] Industries section
- [ ] Technology section
- [ ] Safety section
- [ ] Sustainability section
- [ ] Careers section

### Phase 4: Flowing Sections (10-13)
- [ ] Testimonials section
- [ ] FAQ section
- [ ] Contact section
- [ ] Footer section

### Phase 5: Polish
- [ ] Implement global scroll snap
- [ ] Add reduced motion support
- [ ] Test reverse scroll
- [ ] Optimize images
- [ ] Mobile responsiveness
- [ ] Build and deploy
