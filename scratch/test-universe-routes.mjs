import assert from "node:assert";
import { getCreativeWorldData, normalizeUniverseWork } from "../frontend/lib/services/universeAdapter.js";
import { FALLBACK_WORLDS, FALLBACK_CATEGORIES } from "../frontend/lib/constants/universe.js";
import { ALL_DEMO_WORKS } from "../frontend/lib/constants/universeDemoData.js";

async function runUniverseTests() {
  console.log("\n🧪 Running Creative Universe Verification Suite...\n");

  // TEST 1: Graphic Design World Prototype
  console.log("Test 1: Graphic Design World Data");
  const gdData = await getCreativeWorldData("graphic-design");
  assert(gdData.world, "Graphic design world must exist");
  assert.strictEqual(gdData.world.slug, "graphic-design");
  assert(gdData.categories.length >= 6, `Expected >= 6 categories, got ${gdData.categories.length}`);
  assert(gdData.allWorks.length >= 8, `Expected >= 8 works, got ${gdData.allWorks.length}`);

  // Verify categories in Graphic Design
  const expectedGdCategories = [
    "logo-design",
    "brand-identity",
    "poster-design",
    "banner-design",
    "social-media-design",
    "brochure-print-design",
  ];
  for (const slug of expectedGdCategories) {
    const found = gdData.categories.find((c) => c.slug === slug);
    assert(found, `Category ${slug} must exist in Graphic Design`);
    assert(found.works && found.works.length > 0, `Category ${slug} must have works`);
  }
  console.log("  ✓ Graphic Design world has 6 checkpoints and 8 curated works");

  // TEST 2: UI/UX Design World Data
  console.log("Test 2: UI/UX Design World Data");
  const uiData = await getCreativeWorldData("ui-ux-design");
  assert(uiData.world, "UI/UX world must exist");
  assert.strictEqual(uiData.world.slug, "ui-ux-design");
  assert(uiData.categories.length >= 6, "Expected >= 6 UI/UX categories");
  assert(uiData.allWorks.length >= 3, "Expected >= 3 UI/UX works");
  console.log("  ✓ UI/UX Design world verified");

  // TEST 3: Web Development World Data
  console.log("Test 3: Web Development World Data");
  const devData = await getCreativeWorldData("web-development");
  assert(devData.world, "Web Dev world must exist");
  assert.strictEqual(devData.world.slug, "web-development");
  assert(devData.categories.length >= 5, "Expected >= 5 Web Dev categories");
  assert(devData.allWorks.length >= 3, "Expected >= 3 Web Dev works");
  console.log("  ✓ Web Development world verified");

  // TEST 4: Video & Motion World Data
  console.log("Test 4: Video & Motion World Data");
  const vmData = await getCreativeWorldData("video-motion");
  assert(vmData.world, "Video & Motion world must exist");
  assert.strictEqual(vmData.world.slug, "video-motion");
  assert(vmData.categories.length >= 6, "Expected >= 6 Video categories");
  assert(vmData.allWorks.length >= 3, "Expected >= 3 Video works");

  // Check video provider & safe URLs
  const videoWork = vmData.allWorks.find((w) => w.video_provider !== "none");
  assert(videoWork, "Must have a video work with video provider");
  assert(videoWork.video_url.includes("youtube") || videoWork.video_url.includes("vimeo"), "Video URL must be safe YouTube or Vimeo");
  console.log("  ✓ Video & Motion world verified with safe video links");

  // TEST 5: Work Normalization & Structure
  console.log("Test 5: Work Normalization & Gallery integrity");
  for (const work of ALL_DEMO_WORKS) {
    const normalized = normalizeUniverseWork(work);
    assert(normalized.id, "Work must have an ID");
    assert(normalized.slug, "Work must have a slug");
    assert(normalized.title, "Work must have a title");
    assert(normalized.cover_image_url, "Work must have a cover image");
    assert(Array.isArray(normalized.gallery), "Gallery must be an array");
    assert(normalized.gallery.length > 0, "Gallery must not be empty");
    assert(normalized.gallery[0].url, "Gallery items must have URL");
  }
  console.log(`  ✓ All ${ALL_DEMO_WORKS.length} demo works pass strict normalization contracts`);

  // TEST 6: Existing Case Study Slugs Preserved
  console.log("Test 6: Existing Case Study Slugs Preserved");
  const realSlugs = ["iiuc-cover-generator", "osmentor-ai", "protocolzero"];
  for (const slug of realSlugs) {
    const isPreserved = [...uiData.allWorks, ...devData.allWorks].some(
      (w) => w.case_study_slug === slug || w.slug === slug
    );
    assert(isPreserved, `Case study ${slug} must be mapped and preserved`);
  }
  console.log("  ✓ Real case-study routes and deep links preserved");

  console.log("\n🎉 ALL CREATIVE UNIVERSE VERIFICATION TESTS PASSED!\n");
}

runUniverseTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
