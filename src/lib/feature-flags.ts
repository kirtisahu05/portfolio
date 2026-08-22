// Neither UI variant ("systems" / theme a, "signal" / theme b) is finished
// yet. Content work is the current priority, so the UI switcher stays behind
// this flag — off by default — and UI1 ("systems") is the only thing visitors
// see until UI2 is ready to ship. Flip NEXT_PUBLIC_MULTI_UI_ENABLED=true in
// .env.local to turn the switcher back on for UI work.
export const MULTI_UI_ENABLED = process.env.NEXT_PUBLIC_MULTI_UI_ENABLED === "true";

// The Skills section's "Currently exploring" block calls out tech that isn't
// production-hands-on yet. Off by default (block shows); flip
// NEXT_PUBLIC_HIDE_EXPLORING=true in .env.local to hide it on demand.
export const HIDE_EXPLORING = process.env.NEXT_PUBLIC_HIDE_EXPLORING === "true";

// The Prep tab is still being built out (content/tabs are actively being
// filled in). Hides its nav link while leaving the /prep route itself
// reachable for direct testing. Flip NEXT_PUBLIC_PREP_NAV_ENABLED=true in
// .env.local once it's ready to link from the nav.
export const PREP_NAV_ENABLED = process.env.NEXT_PUBLIC_PREP_NAV_ENABLED === "true";
