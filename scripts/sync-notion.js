/**
 * Notion to WordPress Portfolio Sync Script
 * Usage: npm run sync-notion
 */

async function main() {
  const syncModule = await import("../src/lib/notionWordpressSync.js");
  const { syncReadyPages } = syncModule.default || syncModule;

  console.log("🚀 Starting Notion -> WordPress Sync...\n");

  const results = await syncReadyPages({ logger: console });

  if (results.length === 0) {
    console.log(
      '💡 Tip: In Notion, change the "สถานะงาน (Work Status)" of any project to "พร้อมเผยแพร่ (Ready to Publish)", then run this script again!'
    );
    return;
  }

  console.log("\n🎉 Notion -> WordPress Sync completed successfully!");
}

main().catch((error) => {
  console.error("❌ Notion -> WordPress Sync failed:", error);
  process.exitCode = 1;
});
