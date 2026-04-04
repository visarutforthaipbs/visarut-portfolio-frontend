"use client";

import { Layout } from "@/components/layout";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { JsonLd } from "@/components/JsonLd";

// Dynamically import ReactCompareImage to avoid SSR issues
const ReactCompareImage = dynamic(() => import("react-compare-image"), {
  ssr: false,
});

// CTA Button Component
const CTAButton = () => (
  <a
    href="https://docs.google.com/forms/d/e/1FAIpQLSdxdTy2w99szZgmk6yvfiVkE4PZSv6N7-ofgFX8n3AZ3C5VlA/viewform"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-accent text-base hover:bg-[#d97706] hover:-translate-y-0.5 hover:shadow-lg active:bg-[#c2680a] active:translate-y-0 transition-all duration-200 px-8 py-3 text-base md:text-lg font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
  >
    โหลด Preset ได้ที่นี่
  </a>
);

export default function PersonalProjectsPage() {
  // Load EmbedSocial iframe bridge script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@mirrorapp/iframe-bridge@latest/dist/index.umd.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "#PHOTOFORAIR - เปลี่ยนภาพเพื่ออากาศที่เท่ากัน",
    description:
      "แคมเปญสังคมที่ใช้ Photography Preset เพื่อระดมทุนซื้อหน้ากาก N95 แจกจ่ายให้แรงงานข้ามชาติในเชียงใหม่ ช่วยลดความเหลื่อมล้ำในการเข้าถึงอากาศบริสุทธิ์",
    creator: {
      "@type": "Person",
      name: "Visarut Sankham",
      url: "https://visarut.com",
    },
    datePublished: "2021-02-01",
    inLanguage: "th-TH",
    about: {
      "@type": "Thing",
      name: "วิกฤตฝุ่นควัน PM2.5 ในเชียงใหม่",
    },
    keywords:
      "PHOTOFORAIR, CNXPM2.5, ฝุ่นควัน, PM2.5, เชียงใหม่, แคมเปญสังคม, แรงงานข้ามชาติ, หน้ากาก N95",
    image: {
      "@type": "ImageObject",
      url: "https://visarut.com/image/pfa/x2-1-2.jpg",
      width: 1200,
      height: 630,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "13016",
      ratingCount: "1",
      bestRating: "100000",
      worstRating: "0",
      description: "จำนวนเงินที่ได้จากการขาย Preset (บาท)",
    },
  };

  return (
    <Layout>
      <JsonLd data={structuredData} />

      {/* Hero Section with Background Image */}
      <section
        role="region"
        aria-label="#PHOTOFORAIR"
        className="relative w-screen h-[45vh] md:h-[70vh] overflow-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat after:content-[''] after:absolute after:inset-0 after:bg-black/50"
          style={{ backgroundImage: "url('/image/pfa/x2-1-2.jpg')" }}
        />

        {/* Hero Content */}
        <div className="h-full relative z-[1] flex items-center justify-center px-5 md:px-6">
          <div className="flex flex-col gap-4 items-center w-full max-w-[1200px]">
            <div className="flex items-center gap-3 justify-center">
              <span className="bg-surface text-content px-4 py-2 rounded-full text-base">
                Social Campaign
              </span>
              <span className="bg-surface-hover text-content px-4 py-2 rounded-full text-base">
                Photography
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
              #PHOTOFORAIR
            </h1>
            <p className="text-xl md:text-2xl text-white text-center" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
              เปลี่ยนภาพถ่ายเพื่ออากาศที่เท่ากัน
            </p>
            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="bg-surface p-6 rounded-lg border border-edge shadow-sm">
                <div className="flex flex-col gap-2 items-center">
                  <span className="text-sm text-dim thai-text">จำนวนเงินที่ได้แล้ว</span>
                  <h2 className="text-3xl text-content font-bold">13,016 บาท</h2>
                </div>
              </div>
              <div className="bg-surface p-6 rounded-lg border border-edge shadow-sm">
                <div className="flex flex-col gap-2 items-center">
                  <span className="text-sm text-dim thai-text">จำนวนหน้ากาก N95</span>
                  <h2 className="text-3xl text-content font-bold">591 ชิ้น</h2>
                </div>
              </div>
            </div>

            {/* CTA Button in Hero */}
            <CTAButton />
          </div>
        </div>
      </section>

      <hr className="border-edge" />

      {/* Why We Do This - Rationale */}
      <section
        role="region"
        aria-label="ที่มาของแคมเปญ"
        className="flex flex-col gap-6 items-start w-full max-w-3xl mx-auto px-5 md:px-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-content text-center w-full pt-12 md:pt-20">
          แม้แต่อากาศหายใจของเรายังไม่เท่ากัน
        </h2>

        <p className="text-sm md:text-lg text-muted leading-[1.8] text-left">
          ปัญหาฝุ่นควัน PM2.5
          ในเชียงใหม่วิกฤตจนทำให้มีผู้เสียชีวิตจากการดับไฟป่า 5 คนในปีที่แล้ว
          และส่งผลกระทบโดยตรงต่อสุขภาพส่วนตัวของผู้เขียนจนเลือดกำเดาไหลขณะหาข้อมูลเรื่องนี้
          การอยู่ในเชียงใหม่ 1 เดือน ในช่วงวิกฤตฝุ่นควัน
          เปรียบได้กับการสูบบุหรี่ 120 มวน หรือทำให้ชีวิตสั้นลงประมาณ 1
          วันต่อเดือน
        </p>

        <p className="text-sm md:text-lg text-muted leading-[1.8] text-left">
          หลายคนต้องใช้ชีวิตกว่า 3 เดือนภายใต้หมอกควันพิษตลอด 24 ชั่วโมง
          การป้องกันตัวด้วยเครื่องฟอกอากาศ (ราคาเริ่มต้นกว่า 3,000 บาท)
          และหน้ากาก N95 ได้กลายเป็น &ldquo;ของหรูหรา&rdquo; สำหรับคนจำนวนมาก
          โดยเฉพาะกลุ่มคนจนและแรงงานข้ามชาติที่มีรายได้จำกัดและไม่สามารถเข้าถึงอุปกรณ์เหล่านี้ได้
          ทั้งที่ตามสถิติมีคนอย่างน้อยกว่า 100,000
          คนในเชียงใหม่ที่ต้องการอากาศบริสุทธิ์
        </p>

        <p className="text-sm md:text-lg text-muted leading-[1.8] text-left">
          กลุ่มแรงงานข้ามชาติที่ทำงานเสี่ยงอยู่แล้ว มองว่าฝุ่นควัน PM2.5
          เป็นเพียงปัญหาเล็กน้อยเมื่อเทียบกับปัญหาหลักด้านรายได้และความมั่นคง
          แต่ทำได้เพียงใช้หน้ากากอนามัยราคาถูก เพราะหน้ากาก N95
          ราคาสูงเกินกำลังซื้อ ส่งผลให้แม้จะเผชิญวิกฤตเดียวกัน
          แต่ได้รับผลกระทบไม่เท่ากัน
        </p>

        <div className="bg-surface p-4 md:p-6 rounded-lg border-l-[6px] border-accent w-full">
          <p className="text-base md:text-xl text-content leading-[1.8] font-semibold text-left">
            ผมเชื่อว่า &ldquo;เราไม่ควรที่จะต้องจ่ายเพื่อหายใจ&rdquo;
            อากาศบริสุทธิ์ควรเป็นสิทธิ์ที่ทุกคนเข้าถึงได้เท่าเทียมกัน
            ในระหว่างที่รอการแก้ไขปัญหาฝุ่นควันอย่างยั่งยืน
            จึงต้องการลดความเหลื่อมล้ำนี้ผ่านแคมเปญระดมทุนจากการขาย Preset
            รูปถ่าย &ldquo;CNXPM2.5&rdquo; เพื่อนำเงินไปซื้อหน้ากาก N95
            แจกจ่ายให้แรงงานข้ามชาติในเชียงใหม่
            เพื่อให้ทุกคนได้หายใจในอากาศบริสุทธิ์ที่เท่าเทียมกันมากขึ้น
          </p>
        </div>

        {/* CTA Button after Rationale */}
        <div className="flex justify-center w-full mt-8">
          <CTAButton />
        </div>
      </section>

      <div className="flex justify-center w-full pt-12 md:pt-16">
        <hr className="border-edge w-[60%] max-w-[600px]" />
      </div>

      {/* Collaboration Section */}
      <section
        role="region"
        aria-label="ความร่วมมือ"
        className="flex flex-col gap-6 items-start w-full max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-content text-center w-full">
          ความร่วมมือ
        </h2>

        <div className="bg-surface p-4 sm:p-6 md:p-8 rounded-xl border border-edge w-full">
          <div className="flex flex-col gap-4 items-start">
            <div className="w-full">
              <h3 className="text-lg md:text-xl font-semibold text-content mb-2">
                ร่วมมือกับ ตี่ต่าง
              </h3>
              <p className="text-sm md:text-lg text-muted leading-[1.8] mb-4">
                แคมเปญนี้ดำเนินการร่วมกับ <strong>ตี่ต่าง</strong>
                ผู้ที่ทำงานใกล้ชิดกับชุมชนแรงงานข้ามชาติในเชียงใหม่
                โดยตี่ต่างเป็นผู้ช่วยจัดเก็บเงินที่ได้จากการขาย preset
                และดำเนินการแจกจ่ายหน้ากาก N95 ให้กับแรงงานข้ามชาติโดยตรง
                เพื่อให้มั่นใจว่าความช่วยเหลือไปถึงผู้ที่ต้องการอย่างแท้จริง
              </p>
              <a
                href="https://www.facebook.com/profile.php?id=100068235085612"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-base hover:bg-[#d97706] hover:-translate-y-px transition-all duration-200 px-4 py-2 text-sm md:text-base rounded-md w-full sm:w-auto justify-center"
              >
                <span className="text-base md:text-lg"></span>
                <span>ดูโปรไฟล์ Facebook ของตี่ต่าง</span>
              </a>
            </div>

            <div className="bg-base p-4 rounded-md border-l-4 border-accent w-full">
              <p className="text-sm text-dim leading-[1.7] italic">
                การทำงานร่วมกับคนในพื้นที่ช่วยให้เราเข้าถึงและเข้าใจความต้องการของชุมชนได้อย่างแท้จริง
                และทำให้มั่นใจได้ว่าความช่วยเหลือไปถึงมือของผู้ที่ต้องการจริง ๆ
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center w-full pb-8 md:pb-12">
        <hr className="border-edge w-[60%] max-w-[600px]" />
      </div>

      {/* Media Coverage Section */}
      <section
        role="region"
        aria-label="ข่าวและการรายงาน"
        className="flex flex-col gap-6 items-start w-full max-w-4xl mx-auto px-5 md:px-6 py-12 md:py-16"
      >
        <div className="flex flex-col gap-3 w-full text-center px-2 md:px-0">
          <h2 className="text-2xl md:text-3xl font-bold text-content">
            ข่าวและการรายงาน
          </h2>
          <p className="text-sm md:text-lg text-dim">
            แคมเปญนี้ได้เริ่มต้นตั้งแต่ปี 2564 และได้รับความสนใจจากสื่อหลายแห่ง
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full mt-6">
          {/* Prachatai */}
          <a
            href="https://prachatai.com/journal/2021/02/91510"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-surface p-5 md:p-6 rounded-lg border border-edge h-full transition-all duration-200 md:hover:-translate-y-1 hover:bg-surface-hover hover:border-accent">
              <div className="flex flex-col gap-3 items-start">
                <span className="bg-accent-dim text-accent px-3 py-1 rounded-full text-xs">
                  ข่าว
                </span>
                <h3 className="text-lg md:text-xl font-semibold text-content leading-[1.4]">
                  Prachatai
                </h3>
                <p className="text-sm text-dim leading-relaxed">
                  รายงานข่าวเกี่ยวกับแคมเปญ #PHOTOFORAIR
                  และการช่วยเหลือแรงงานข้ามชาติ
                </p>
                <span className="text-xs text-dim thai-text">
                  กุมภาพันธ์ 2564
                </span>
              </div>
            </div>
          </a>

          {/* Urban Creature */}
          <a
            href="https://urbancreature.co/whatsup-cnxpm25/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-surface p-5 md:p-6 rounded-lg border border-edge h-full transition-all duration-200 md:hover:-translate-y-1 hover:bg-surface-hover hover:border-accent">
              <div className="flex flex-col gap-3 items-start">
                <span className="bg-accent-dim text-accent px-3 py-1 rounded-full text-xs">
                  บทความ
                </span>
                <h3 className="text-lg md:text-xl font-semibold text-content leading-[1.4]">
                  Urban Creature
                </h3>
                <p className="text-sm text-dim leading-relaxed">
                  What&apos;s Up #CNXPM2.5 -
                  บทความเจาะลึกเกี่ยวกับแคมเปญและปัญหาฝุ่นควันในเชียงใหม่
                </p>
              </div>
            </div>
          </a>
        </div>

        <div className="bg-surface p-6 rounded-lg w-full mt-6">
          <p className="text-sm md:text-base text-muted leading-[1.8] text-center">
            แคมเปญ #PHOTOFORAIR ดำเนินการมาตั้งแต่ปี 2564 จนถึงปัจจุบัน
            และได้รับการตอบรับที่ดีจากสังคม ช่วยให้เราสามารถแจกจ่ายหน้ากาก N95
            ให้กับแรงงานข้ามชาติในเชียงใหม่ได้อย่างต่อเนื่อง
          </p>
        </div>
      </section>

      <div className="flex justify-center w-full pb-12 md:pb-16">
        <hr className="border-edge w-[60%] max-w-[600px]" />
      </div>

      {/* Main Content */}
      <div className="bg-base py-16 md:py-20 w-full flex justify-center">
        <div className="max-w-[1200px] px-4 md:px-8 w-full">
          <div className="flex flex-col gap-12 items-center w-full">
            {/* #PHOTOFORAIR Project */}
            <div className="flex flex-col gap-8 items-center w-full">
              {/* Preset Sections */}
              <div className="flex flex-col gap-8 items-center w-full">
                <div className="w-full max-w-3xl px-2 md:px-0">
                  <h2 className="text-lg md:text-2xl font-semibold text-content mb-3 text-left">
                    3 ลักษณะเด่นของ &ldquo;ฤดูฝุ่นควัน&rdquo; ในเชียงใหม่
                  </h2>

                  <p className="text-sm md:text-lg text-muted leading-[1.8] mb-4 text-left">
                    ความสามารถพิเศษของคนที่อาศัยอยู่ในเชียงใหม่แบบผม
                    คือสามารถที่จะบอกได้ว่าฝุ่นควันที่เห็นอยู่ตรงหน้านี้น่าจะมีค่า
                    AQI เท่าไหร่ โดยสังเกตจากลักษณะของแสง สี
                    และคอนทราสต์ที่มองเห็น และผมได้นำลักษณะเด่นเหล่านี้มาออกแบบ
                    เป็น preset ชุด &ldquo;CNXPM2.5&rdquo;
                    เพื่อให้ทุกคนได้สัมผัสกับ &ldquo;ฤดูฝุ่นควัน&rdquo;
                    ในเชียงใหม่ผ่านภาพถ่ายของตัวเอง โดยมี 3
                    ลักษณะเด่นที่สำคัญดังนี้
                  </p>
                </div>
                {/* Soft-Box from Haze */}
                <div className="w-full max-w-3xl px-2 md:px-0">
                  <h3 className="text-lg md:text-2xl font-semibold text-content mb-3 text-left">
                    1.แสงนุ่ม ๆ จากฝุ่นควันที่ปกคลุม (Soft-Box from Haze)
                  </h3>

                  <p className="text-sm md:text-lg text-muted leading-[1.8] mb-4 text-left">
                    ทุกวันนี้ ชีวิตชาวเชียงใหม่ในช่วงเดือนมีนาคม-พฤษภาคม
                    รู้จักมักคุ้นกับสภาพอากาศระดับ 150 – 500 AQI เป็นอย่างดี
                    เพราะบรรยากาศเช่นนี้ ปกคลุมเมืองเชียงใหม่ตั้งแต่เช้ายันเช้า
                    กินข้าว ปวดขี้ ก็ต้องพบเจอกับฝุ่นนี้อย่างหลีกหนีไม่ได้
                    ด้วยสภาพการณ์อย่างนี้เอง มันจึงเปรียบเสมือนการใช้ Softbox
                    ครอบคลุมดวงอาทิตย์อันร้อนแรงในหน้าแล้งเอาไว้
                    ทำให้ภาพที่คนเชียงใหม่เห็นค่อนข้างนุ่มนวล Low-contrast
                    จนแทบขาดอากาศหายใจ
                  </p>

                  {/* Before/After Image Comparison */}
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <ReactCompareImage
                      leftImage="/image/pfa/DSC00094-scaled.jpg"
                      rightImage="/image/pfa/DSC00094-1-scaled.jpg"
                      sliderLineWidth={3}
                      sliderLineColor="white"
                      handleSize={50}
                      hover={true}
                    />
                  </div>

                  <div className="bg-surface p-4 rounded-md border-l-4 border-edge">
                    <p className="text-sm font-semibold text-muted mb-2">
                      Creative tip
                    </p>
                    <p className="text-sm text-muted leading-[1.7]">
                      ลองปรับภาพถ่ายของคุณที่สดใสด้วยการลด saturation และ
                      exposure หลังจากใช้ CNXPM2.5
                      จะทำให้คุณได้ภาพถ่ายที่หม่นหมองเหมือนอยู่ในเชียงใหม่ในทุก
                      ๆ วัน
                    </p>
                  </div>
                </div>

                {/* Warm Tone by Wildfire */}
                <div className="w-full max-w-3xl px-2 md:px-0">
                  <h3 className="text-lg md:text-2xl font-semibold text-content mb-3 text-left">
                    2.โทนอุ่น ๆ จากไฟป่ายามพระอาทิตย์ตก (Warm Tone by Wildfire)
                  </h3>

                  <p className="text-sm md:text-lg text-muted leading-[1.8] mb-4 text-left">
                    อีกจุดเด่นสำคัญของ CNXPM2.5
                    คือสีเหลืองอบอวนอยู่ในจังหวัดเชียงใหม่
                    โดยได้รับแรงบัลดาลใจมากจากสีของท้องฟ้ายามเย็นและไฟป่าที่ไหม้อยู่บนดอยสุเทพ
                    ทำให้ท้องฟ้าเชียงใหม่ปกคลุมไปด้วยสีเหลืองที่ดูเหมือตอนจบของหนังรักโรแมนติก
                    แต่พระเอกต้องใส่หน้ากากอนามัยระหว่างจูบนางเอก
                  </p>
                  {/* Before/After Image Comparison */}
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <ReactCompareImage
                      leftImage="/image/pfa/DSC00084-scaled.jpg"
                      rightImage="/image/pfa/DSC00084-1-scaled.jpg"
                      sliderLineWidth={3}
                      sliderLineColor="white"
                      handleSize={50}
                      hover={true}
                    />
                  </div>
                  <div className="bg-surface p-4 rounded-md border-l-4 border-edge">
                    <p className="text-sm font-semibold text-muted mb-2">
                      Creative tip
                    </p>
                    <p className="text-sm text-muted leading-[1.7]">
                      เพื่อที่จะทำให้ได้โทนสีเหลืองปนส้มคล้ายกับท้องฟ้ายามเย็นช่วงไฟป่าดอยสุเทพ
                      แนะนำให้ปรับ Temp ไปที่ช่วง 5500 และ Tint
                      ไปที่ช่วงสีเขียวเพิ่ม
                    </p>
                  </div>
                </div>

                {/* Faded Look by Air pollution */}
                <div className="w-full max-w-3xl px-2 md:px-0">
                  <h3 className="text-lg md:text-2xl font-semibold text-content mb-3 text-left">
                    3.โทนหม่น ๆ จากฝุ่นควัน 500 AQI (Faded Look by Air
                    pollution)
                  </h3>

                  <p className="text-sm md:text-lg text-muted leading-[1.8] mb-4 text-left">
                    faded look
                    นี้จะเห็นได้เฉพาะช่วงที่ฝุ่นควันมีความหนาแน่นสูงหรือตั้งแต่
                    500 AQI ขึ้นไป ลักษณะสำคัญคือ Faded look
                    ที่ลอกแบบมาจนแทบจะถูกฟ้องลิขสิทธิ์จากฝุ่นควันอันลอยล่องไม่พร่องจากท้องฟ้าเชียงใหม่
                    ควันที่พร้อมร่วมทุกกิจกรรมที่คุณได้ทำ
                    ไม่ว่าจะเดินซื้อเห็ดโคนในตลาดหรือใส่บาตรยามเช้า
                    หรือกินข้าวตอนกลางวันหรือนอนฝันที่โรงเรียน
                    หรือเวียนเทียนวันพระใหญ่ แน่นอนว่ามันจะทำให้ทุกภาพของคนดูเบา
                    เหมือนทาทับด้วยสีเทาบาง ๆ ไว้ จนใครเห็นภาพจำต้องไอ
                    เพราะมันไปสะกิดต่อมอะไรในลำคอ และโพรงจมูก
                  </p>
                  {/* Before/After Image Comparison */}
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <ReactCompareImage
                      leftImage="/image/pfa/DSC00527-2-scaled.jpg"
                      rightImage="/image/pfa/DSC00527-1-scaled.jpg"
                      sliderLineWidth={3}
                      sliderLineColor="white"
                      handleSize={50}
                      hover={true}
                    />
                  </div>
                  <div className="bg-surface p-4 rounded-md border-l-4 border-edge">
                    <p className="text-sm font-semibold text-muted mb-2">
                      Creative tip
                    </p>
                    <p className="text-sm text-muted leading-[1.7]">
                      preset นี้จะเหมาะเจาะอย่างยิ่งกับภาพ Landscape
                      ที่ไม่ได้มีผู้คนเป็นจุดสนใจ เพราะด้านบนของภาพมีการเพิ่ม
                      dehaze
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button after Presets */}
              <div className="flex justify-center w-full my-8">
                <CTAButton />
              </div>

              <div className="flex justify-center w-full pt-12 md:pt-16">
                <hr className="border-edge w-[60%] max-w-[600px]" />
              </div>

              {/* Campaign Call to Action */}
              <div className="flex flex-col gap-6 items-start w-full max-w-3xl mx-auto px-4 md:px-0">
                <h2 className="text-xl md:text-2xl font-semibold text-content text-center w-full">
                  ตัวอย่างภาพที่ใช้ CNXPM2.5
                </h2>
                <p className="text-sm md:text-lg text-muted leading-[1.8] text-left">
                  สามารถใช้ preset ตัวนี้แล้ว tag #cnxpm25 และ #photoforair ใน
                  instagram ได้เลย แล้วภาพจะถูกนำมา repost ในนี้
                </p>
                {/* Instagram Feed from EmbedSocial */}
                <div className="w-full mt-12">
                  <iframe
                    src="https://app.mirror-app.com/feed-instagram/351ad4cb-df04-4add-b467-fbe826b8bf03/preview"
                    title="Instagram feed #PHOTOFORAIR"
                    style={{
                      width: "100%",
                      border: "none",
                      overflow: "hidden",
                    }}
                    scrolling="no"
                    onLoad={(e: React.SyntheticEvent<HTMLIFrameElement>) => {
                      if (typeof window !== "undefined") {
                        const win = window as typeof window & {
                          iFrameSetup?: (el: HTMLIFrameElement) => void;
                        };
                        if (typeof win.iFrameSetup === "function") {
                          win.iFrameSetup(e.currentTarget);
                        }
                      }
                    }}
                  />
                </div>

                {/* Final CTA Button */}
                <div className="flex justify-center w-full mt-8">
                  <CTAButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
