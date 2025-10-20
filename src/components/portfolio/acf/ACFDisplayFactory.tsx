import { ComponentType } from "react";
import { PhotographyACFDisplay } from "./PhotographyACF";
import { VideographyACFDisplay } from "./VideographyACF";
import { VideoEditingACFDisplay } from "./VideoEditingACF";
import { WebsiteACFDisplay } from "./WebsiteACF";
import { GraphicDesignACFDisplay } from "./GraphicDesignACF";
import { PrintACFDisplay } from "./PrintACF";
import { ExhibitionACFDisplay } from "./ExhibitionACF";
import { CampaignACFDisplay } from "./CampaignACF";
import { ProducerACFDisplay } from "./ProducerACF";
import type { CategoryKey } from "@/constants/portfolioCategories";
import type { BaseACFData } from "@/types/acf";

/**
 * Mapping of category keys to their ACF display components
 */
const ACF_COMPONENT_MAP: Record<
  CategoryKey,
  ComponentType<{ acf: BaseACFData }>
> = {
  photography: PhotographyACFDisplay,
  videography: VideographyACFDisplay,
  "video-editing": VideoEditingACFDisplay,
  website: WebsiteACFDisplay,
  "graphic-design": GraphicDesignACFDisplay,
  print: PrintACFDisplay,
  exhibition: ExhibitionACFDisplay,
  campaign: CampaignACFDisplay,
  producer: ProducerACFDisplay,
};

interface ACFDisplayFactoryProps {
  category: CategoryKey;
  acf: BaseACFData;
}

/**
 * Factory component that renders the appropriate ACF display based on category
 * Uses the factory pattern to dynamically select the right component
 */
export function ACFDisplayFactory({ category, acf }: ACFDisplayFactoryProps) {
  const Component = ACF_COMPONENT_MAP[category];

  if (!Component) {
    console.warn(`No ACF component found for category: ${category}`);
    return null;
  }

  return <Component acf={acf} />;
}
