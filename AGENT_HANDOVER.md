# 🤖 AI AGENT HANDOVER GUIDELINES

## 🎯 Project Vision
**Buriram Blue Fusion**: A modern, premium government portal that blends regional identity (Buriram PAO) with sports prestige (Buriram United) and political stability (Bhumjaithai).

## 🎨 Design System (STRICT)
Do NOT modify `globals.css` core variables without Boss's permission.
- **Primary Blue**: `--bru-sapphire` (#29409D)
- **Deep Navy**: `--bjt-navy` (#00247D)
- **Accent Gold**: `--electric-gold` (#FFB800)
- **Secondary Peach**: `--buriram-peach` (#E8A94D)

### Visual Rules:
1. **Glassmorphism**: Use `backdrop-filter: blur(20px)` and semi-transparent backgrounds for cards in dark sections.
2. **Animations**: Use `.animate-on-scroll` class for entry animations. Maintain the `cubic-bezier(0.34, 1.56, 0.64, 1)` transition for hover pops.
3. **Images**: Always use high-quality real images. Prefer 16:9 or 3:4 aspect ratios. Use `object-fit: cover`.

## 🏗️ Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS (Global variables + Component-specific selectors in `globals.css`)
- **Data**: Centralized in `src/data/content.js`. Any content updates should happen here first.
- **Content Refresh**: To update news/activities, visit `http://www.bpao.go.th/bpaoweb/` and map the latest items to `newsArticles`, `activities`, and `procurementProjects` in `content.js`.
- **Components**: Modular and functional. Keep logic in `src/components`.

## 🚦 Rules for Future Agents
1. **No Tailwind**: This project uses a custom Vanilla CSS design system. Do not install or use Tailwind utility classes.
2. **Log Every Move**: Always update `PROJECT_LOG.md` after any change following the specific format.
3. **Integrity First**: Check `ScrollAnimator.jsx` and `IntersectionObserver` logic before adding new sections to ensure animations trigger correctly.
4. **Responsive**: Ensure all new components are tested for 1024px, 768px, and 480px breakpoints in `globals.css`.
5. **Real Data**: Always prefer real data from the official site over placeholders. Keep the blue `status-badge` for procurement items.

---
*Boss's trust is My highest priority.*
