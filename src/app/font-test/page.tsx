import { Layout } from "@/components/layout";

export default function FontTestPage() {
  return (
    <Layout>
      <div className="py-16 bg-base">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-start gap-8">
            <h1 className="text-3xl mb-4 text-content font-bold">
              DB Helvethaica Font Test
            </h1>

            <div className="flex flex-col items-start gap-6 w-full">
              <div>
                <p className="text-sm text-dim mb-2">Font Weight: 400 (Regular)</p>
                <p className="text-xl font-normal text-content">วิศรุต แสนคำ - ผู้เชี่ยวชาญด้านสื่อ</p>
                <p className="text-xl font-normal text-content">Visarut Sankham - Media Professional</p>
              </div>

              <div>
                <p className="text-sm text-dim mb-2">Font Weight: 500 (Medium)</p>
                <p className="text-xl font-medium text-content">วิศรุต แสนคำ - ผู้เชี่ยวชาญด้านสื่อ</p>
                <p className="text-xl font-medium text-content">Visarut Sankham - Creative Professional</p>
              </div>

              <div>
                <p className="text-sm text-dim mb-2">Font Weight: 700 (Bold)</p>
                <p className="text-xl font-bold text-content">วิศรุต แสนคำ - ผู้เชี่ยวชาญด้านสื่อ</p>
                <p className="text-xl font-bold text-content">Visarut Sankham - Creative Professional</p>
              </div>

              <div>
                <p className="text-sm text-dim mb-2">Sample Paragraph</p>
                <p className="text-lg leading-[1.6] text-muted">
                  เราให้บริการครบวงจรด้านสื่อและการสื่อสาร
                  ไม่ว่าจะเป็นการถ่ายภาพ การถ่ายวิดีโอ การพัฒนาเว็บไซต์
                  หรือการออกแบบกราฟิก
                  ด้วยประสบการณ์และความเชี่ยวชาญที่สั่งสมมาอย่างยาวนาน
                </p>
                <p className="text-lg leading-[1.6] mt-4 text-muted">
                  We provide comprehensive media and communication services,
                  including photography, videography, web development, and
                  graphic design. With years of accumulated experience and
                  expertise in the creative industry.
                </p>
              </div>

              <div>
                <p className="text-sm text-dim mb-2">Different Font Sizes</p>
                <div className="flex flex-col items-start gap-2">
                  <p className="text-sm text-muted">Small text - ข้อความขนาดเล็ก</p>
                  <p className="text-base text-muted">Medium text - ข้อความขนาดกลาง</p>
                  <p className="text-lg text-muted">Large text - ข้อความขนาดใหญ่</p>
                  <p className="text-xl text-content">Extra Large text - ข้อความขนาดใหญ่พิเศษ</p>
                  <p className="text-2xl text-content">2XL text - ข้อความขนาด 2XL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
