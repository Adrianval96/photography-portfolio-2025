# Cinematic State Photography Portfolio

This project is a custom implementation of [Payload CMS](https://payloadcms.com/) used to power the business site for **Cinematic State Photography**, my creative photography brand. It's designed to be lightweight, easily maintainable, and extensible as the business scales.

The frontend is deployed on **Vercel**, while the database is managed using **Neon**, a serverless Postgres provider. This setup allows for fast iteration and low operational overhead during early stages of the project.

While the base template accelerated initial layout, all CMS configuration, content modeling, deployment integration, and future test coverage are being handled and customized by me.

---

## Next Steps

- [x] Deploy live frontend with Payload + Vercel
- [x] Implement email contact functionality (contact form)
- [ ] Replace static images with responsive, CDN-optimized versions
- [ ] Add and structure **custom component tests** (Jest + React Testing Library)
- [ ] Build backend API (Node/Django TBD) to serve dynamic data and enable richer features like tagging, filtering, and admin uploads

## Stack description

- **Payload CMS**: Provides flexibility and React-based admin panel, allowing rapid configuration for media-heavy content.
- **Neon DB**: Serverless Postgres with branching support, perfect for fast prototyping and collaboration.
- **Vercel**: Seamless deployment with GitHub integration and Next.js support.
