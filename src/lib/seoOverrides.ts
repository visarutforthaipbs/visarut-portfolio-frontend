/**
 * Search-snippet overrides for individual portfolio items (keyed by WP post id).
 * Only affects <title>/<meta description>/OG — the visible page (h1, body text)
 * still comes from WordPress unchanged. Copy approved by the owner (UX-010).
 */
export const PORTFOLIO_SEO_OVERRIDES: Record<number, { title?: string; description?: string }> = {
  // sexworker-covide — GSC pos ~4, 0% CTR
  6397: {
    title: "Sex Worker เชียงใหม่ยุคโควิด: ชีวิตที่ไร้การเยียวยา | วิดีโอสารคดี ประชาไท",
    description:
      "วิดีโอสารคดีจากเชียงใหม่ช่วงโควิด-19 พนักงานบริการดิ้นรนหลังสถานบันเทิงปิดโดยไร้การเยียวยาจากรัฐ และข้อเรียกร้องของมูลนิธิเอ็มพาวเวอร์ให้ยอมรับ Sex Worker เป็นอาชีพ",
  },
  // เหมืองใกล้ฉัน — GSC pos ~7
  6672: {
    title: "เหมืองใกล้ฉัน: แผนที่เหมืองแร่ใกล้บ้าน เว็บไซต์ GIS กับไทยพีบีเอส",
    description:
      "เว็บไซต์ให้ประชาชนค้นหาเหมืองแร่ที่ดำเนินการอยู่ใกล้บ้านบนแผนที่ GIS เพื่อความโปร่งใสและการมีส่วนร่วมของชุมชน พัฒนาโดยวิศรุต แสนคำ ร่วมกับไทยพีบีเอส",
  },
  // กิจกรรมคัดแยกขยะ — GSC pos ~8
  6068: {
    title: "ภาพกิจกรรมสอนคัดแยกขยะครัวเรือน เชียงใหม่ กับกรีนพีซ ประเทศไทย",
    description:
      "ภาพถ่ายบูทกิจกรรมของกรีนพีซ ประเทศไทย ที่เชียงใหม่ สอนเยาวชนและผู้สนใจแยกขยะครัวเรือนแต่ละประเภท เพื่อให้การจัดการขยะมีประสิทธิภาพมากขึ้น",
  },
};
