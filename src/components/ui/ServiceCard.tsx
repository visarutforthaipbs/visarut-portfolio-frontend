"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    category: string;
}

export function ServiceCard({
    icon: Icon,
    title,
    description,
    category,
}: ServiceCardProps) {
    return (
        <Link href={`/portfolio/category/${category}`} aria-label={`${title} - ${description}`}>
            <div className="bg-surface p-4 md:p-6 rounded-lg text-center hover:-translate-y-1 hover:bg-surface-hover transition-all duration-300 cursor-pointer border border-edge">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="text-accent text-xl md:text-2xl" aria-hidden="true">
                        <Icon size={32} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg md:text-xl text-content font-semibold">
                            {title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
