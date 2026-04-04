"use client";

import { Layout } from "@/components/layout";
import { workExperience, awards } from "@/constants/data";
import { ExperienceItem } from "@/components/ui/ExperienceItem";

export default function AboutClient() {
  return (
    <Layout>
      {/* Hero */}
      <section
        className="bg-base py-20 md:py-28 flex justify-center w-full"
        role="region"
        aria-label="เกี่ยวกับ"
      >
        <div className="max-w-3xl mx-auto px-5 md:px-6">
          <div className="flex flex-col gap-5 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-content tracking-tight">
              เกี่ยวกับ
            </h1>
            <p className="text-base md:text-lg text-muted leading-[1.8] max-w-[560px] mx-auto">
              วิศรุต แสนคำ ผู้ผลิตสื่อหลายรูปแบบ
              โดยมีความเชี่ยวชาญเป็นพิเศษกับภาคประชาสังคม องค์กรพัฒนาเอกชน
              และสถาบันการศึกษามากกว่า ซึ่งเขาได้ร่วมทำงานมายาวนานกว่า 10 ปี
              (ตั้งแต่ปี พ.ศ. 2560)
              โดยการทำงานของวิศรุตมุ่งมั่นในการเล่าเรื่องประเด็นทางสังคมผ่านงานสื่อที่เหมาะสมกับเนื้อหา
              เพื่อส่งเสริมการรับรู้และขับเคลื่อนการเปลี่ยนแปลงเชิงสังคม
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-base" aria-hidden="true">
        <div className="w-[60px] h-px bg-edge" />
      </div>

      {/* Experience */}
      <section
        className="bg-base py-16 md:py-24 flex justify-center w-full"
        role="region"
        aria-label="ประสบการณ์"
      >
        <div className="max-w-3xl mx-auto px-5 md:px-6">
          <div className="flex flex-col gap-8">
            <h2 className="text-lg md:text-xl font-medium text-dim uppercase tracking-wider text-center">
              ประสบการณ์
            </h2>
            <div className="flex flex-col gap-4">
              {workExperience.map((job, index) => (
                <ExperienceItem key={index} {...job} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center bg-base" aria-hidden="true">
        <div className="w-[60px] h-px bg-edge" />
      </div>

      {/* Awards */}
      <section
        className="bg-base py-16 md:py-24 flex justify-center w-full"
        role="region"
        aria-label="รางวัล"
      >
        <div className="max-w-3xl mx-auto px-5 md:px-6">
          <div className="flex flex-col gap-8">
            <h2 className="text-lg md:text-xl font-medium text-dim uppercase tracking-wider text-center">
              รางวัล
            </h2>
            <div className="flex flex-col gap-6">
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start py-2 flex-wrap gap-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm md:text-base font-medium text-content">
                      {award.title}
                    </span>
                    <span className="text-sm text-muted">
                      {award.organization}
                      {award.category && ` — ${award.category}`}
                    </span>
                  </div>
                  <span className="text-sm text-dim shrink-0">
                    {award.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
