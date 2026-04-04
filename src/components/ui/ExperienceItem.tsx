"use client";

interface ExperienceItemProps {
    year: string;
    company: string;
    position: string;
    description: string;
    responsibilities: string[];
    current: boolean;
}

export function ExperienceItem({
    year,
    company,
    position,
    description,
    responsibilities,
    current,
}: ExperienceItemProps) {
    return (
        <div className="bg-surface p-6 rounded-lg border border-edge">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between flex-wrap gap-2">
                    <div className="flex flex-col items-start gap-1 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-content">
                                {company}
                            </span>
                            {current && (
                                <span className="bg-accent-dim text-accent px-2 py-0.5 rounded-full text-xs">
                                    ปัจจุบัน
                                </span>
                            )}
                        </div>
                        <span className="text-base text-muted">
                            {position}
                        </span>
                    </div>
                    <span className="text-sm text-dim font-medium">
                        {year}
                    </span>
                </div>

                {/* Job Description */}
                <p className="text-base text-muted leading-relaxed">
                    {description}
                </p>

                {/* Responsibilities */}
                <div>
                    <p className="text-sm font-semibold text-content mb-2">
                        หน้าที่ความรับผิดชอบ:
                    </p>
                    <div className="flex flex-col gap-1">
                        {responsibilities.map((responsibility, idx) => (
                            <p
                                key={idx}
                                className="text-sm text-muted pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent before:font-bold"
                            >
                                {responsibility}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
