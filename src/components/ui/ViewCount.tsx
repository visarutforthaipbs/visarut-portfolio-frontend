import { Eye } from "lucide-react";
import { HStack, Text } from "@chakra-ui/react";

interface ViewCountProps {
  views: number;
  className?: string;
}

export function ViewCount({ views, className = "" }: ViewCountProps) {
  return (
    <HStack gap={1} className={className}>
      <Eye size={16} />
      <Text>
        {views.toLocaleString()} {views === 1 ? "view" : "views"}
      </Text>
    </HStack>
  );
}

export default ViewCount;
