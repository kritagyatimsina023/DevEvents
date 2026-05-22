<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js App Router project. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), which sets up client-side analytics, session replay, and error tracking automatically. A reverse proxy is configured in `next.config.ts` to route PostHog requests through `/ingest`, reducing the chance of ad-blocker interference. Three key user interaction events were instrumented across the component layer.

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the 'Explore Events' button on the homepage to scroll to the events list | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to navigate to the event detail page (captures title, slug, location, date) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the top nav bar (captures destination) | `components/NavBar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1617030)
- [Event engagement overview](/insights/McnpZpo2) — All three events trended over the last 30 days
- [Explore to event click funnel](/insights/JJUeY93A) — Conversion from Explore Events button → event card click
- [Total event card clicks](/insights/9R9kQ2Xx) — Bold number KPI for event card engagement
- [Top events by clicks](/insights/3OzussCX) — Which events attract the most clicks (breakdown by event title)
- [Navigation destination breakdown](/insights/3PVBZ1tY) — Which nav links users click most (breakdown by destination)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
