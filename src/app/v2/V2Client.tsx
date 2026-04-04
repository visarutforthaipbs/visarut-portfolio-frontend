"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import {
  Globe,
  Brain,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
  MapPin,
  Cpu,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   DESIGN TOKENS (Signal 39)
   ───────────────────────────────────────────── */
const T = {
  bg: "#0F1117",
  surface: "#161922",
  surfaceHover: "#1C1F2B",
  border: "#23273A",
  text: "#E8E8ED",
  textMuted: "#8B8FA3",
  textDim: "#565B73",
  accent: "#ED8936",
  accentDim: "rgba(237,137,54,0.12)",
  breathing: { base: "40px", md: "64px" },
} as const;

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */

interface Pillar {
  icon: typeof Globe;
  title: string;
  subtitle: string;
  projects: Project[];
}

interface Project {
  name: string;
  impact: string;
  metric: string;
  stack: string[];
  url?: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Globe,
    title: "Civic Technology",
    subtitle: "Building Transparency Tools",
    projects: [
      {
        name: "Factories Near Me",
        impact: "Industrial transparency tool mapping factory pollution data across Thai provinces for public oversight.",
        metric: "Covering 70,000+ registered factories",
        stack: ["Next.js", "QGIS", "PostGIS", "OpenStreetMap"],
        url: "#",
      },
      {
        name: "Local Admin Near Me",
        impact: "Civic mapping platform connecting citizens to their local governance structures and representatives.",
        metric: "Mapped 7,000+ local administrative units",
        stack: ["React", "Leaflet", "GeoJSON", "REST API"],
        url: "#",
      },
    ],
  },
  {
    icon: Brain,
    title: "Public Intelligence",
    subtitle: "Policy Analysis & Impact",
    projects: [
      {
        name: "Thai PBS – Public Intelligence Unit",
        impact: "Systematic analysis of policy manipulation networks and public discourse patterns for national broadcaster.",
        metric: "Analysis informing 2M+ viewers",
        stack: ["Python", "Network Analysis", "OSINT", "Data Visualization"],
        url: "#",
      },
    ],
  },
  {
    icon: BarChart3,
    title: "Data Science (NLP)",
    subtitle: "Language Processing at Scale",
    projects: [
      {
        name: "Multilingual Discourse Clustering",
        impact: "NLP pipeline for clustering and sentiment analysis of Thai public discourse to detect coordinated narratives.",
        metric: "Processing 100K+ documents",
        stack: ["Python", "multilingual-e5", "UMAP", "HDBSCAN"],
        url: "#",
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────── */

function PillarCard({ pillar }: { pillar: Pillar }) {
  const [expanded, setExpanded] = useState(false);
  const toggle = useCallback(() => setExpanded((p) => !p), []);

  return (
    <Box
      bg={T.surface}
      border="1px solid"
      borderColor={T.border}
      borderRadius="12px"
      p={{ base: 6, md: 8 }}
      transition="border-color 0.25s, background 0.25s"
      _hover={{ borderColor: T.accent, bg: T.surfaceHover }}
      cursor="pointer"
      onClick={toggle}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <HStack gap={3}>
          <Flex
            w="40px"
            h="40px"
            align="center"
            justify="center"
            borderRadius="8px"
            bg={T.accentDim}
            flexShrink={0}
          >
            <Icon as={pillar.icon} boxSize={5} color={T.accent} />
          </Flex>
          <VStack align="start" gap={0}>
            <Heading
              as="h3"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="600"
              color={T.text}
              lineHeight="1.2"
            >
              {pillar.title}
            </Heading>
            <Text fontSize="sm" color={T.textMuted} lineHeight="1.4">
              {pillar.subtitle}
            </Text>
          </VStack>
        </HStack>
        <Icon
          as={expanded ? ChevronUp : ChevronDown}
          boxSize={5}
          color={T.textDim}
          transition="transform 0.2s"
          flexShrink={0}
        />
      </Flex>

      {/* Collapsed summary */}
      {!expanded && (
        <Text fontSize="sm" color={T.textDim} mt={1}>
          {pillar.projects.length} project{pillar.projects.length > 1 ? "s" : ""}
        </Text>
      )}

      {/* Expanded: project list */}
      {expanded && (
        <VStack
          gap={T.breathing}
          align="stretch"
          mt={6}
          pt={6}
          borderTop="1px solid"
          borderColor={T.border}
        >
          {pillar.projects.map((project) => (
            <ProjectDetail key={project.name} project={project} />
          ))}
        </VStack>
      )}
    </Box>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const [showStack, setShowStack] = useState(false);

  return (
    <VStack align="start" gap={3}>
      {/* 1. The Meaning (Priority) */}
      <HStack gap={2} align="center">
        <Heading
          as="h4"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          color={T.text}
          lineHeight="1.3"
        >
          {project.name}
        </Heading>
        {project.url && (
          <Link href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name}`}>
            <Icon as={ExternalLink} boxSize={3.5} color={T.textDim} _hover={{ color: T.accent }} transition="color 0.15s" />
          </Link>
        )}
      </HStack>

      <Text
        fontSize={{ base: "sm", md: "md" }}
        color={T.textMuted}
        lineHeight="1.7"
      >
        {project.impact}
      </Text>

      {/* 2. The Outcome (Secondary) */}
      <HStack gap={2}>
        <Box w="3px" h="16px" bg={T.accent} borderRadius="full" flexShrink={0} />
        <Text fontSize="sm" fontWeight="500" color={T.accent}>
          {project.metric}
        </Text>
      </HStack>

      {/* 3. The Engine (Tertiary) — collapsed by default */}
      <Box>
        <Text
          as="button"
          fontSize="xs"
          color={T.textDim}
          cursor="pointer"
          _hover={{ color: T.textMuted }}
          transition="color 0.15s"
          onClick={(e) => {
            e.stopPropagation();
            setShowStack((p) => !p);
          }}
          textTransform="uppercase"
          letterSpacing="0.08em"
          fontWeight="500"
        >
          {showStack ? "Hide" : "Show"} technical stack
        </Text>
        {showStack && (
          <HStack gap={2} mt={2} flexWrap="wrap">
            {project.stack.map((tech) => (
              <Text
                key={tech}
                fontSize="xs"
                color={T.textMuted}
                bg={T.accentDim}
                px={2.5}
                py={1}
                borderRadius="full"
                whiteSpace="nowrap"
              >
                {tech}
              </Text>
            ))}
          </HStack>
        )}
      </Box>
    </VStack>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────── */

export default function V2Client() {
  return (
    <Box bg={T.bg} minH="100vh" color={T.text}>

      {/* ── LAYER 1: SUBCONSCIOUS HOOK ── */}
      <Box
        as="section"
        role="region"
        aria-label="Introduction"
        position="relative"
        overflow="hidden"
        py={{ base: 24, md: 36 }}
      >
        {/* Subtle grid texture (subconscious authority cue) */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.04}
          backgroundImage="radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)"
          backgroundSize="32px 32px"
          aria-hidden="true"
        />

        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }} position="relative">
          <VStack gap={6} align="start">
            {/* Name — stark, typographic */}
            <Text
              fontSize="sm"
              fontWeight="500"
              color={T.accent}
              textTransform="uppercase"
              letterSpacing="0.12em"
            >
              Visarut Sankham
            </Text>

            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              fontWeight="700"
              lineHeight="1.08"
              letterSpacing="-0.03em"
              color={T.text}
              maxW="680px"
            >
              Public Intelligence
              <br />
              <Text as="span" color={T.textMuted}>
                & Civic Systems
              </Text>
            </Heading>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={T.textMuted}
              lineHeight="1.7"
              maxW="520px"
            >
              Building data systems that create transparency, inform public
              policy, and strengthen civic institutions in Thailand.
            </Text>

            {/* Signal badges — quick authority markers */}
            <HStack gap={4} mt={2} flexWrap="wrap">
              {[
                { icon: MapPin, label: "Bangkok" },
                { icon: Users, label: "Thai PBS" },
                { icon: Cpu, label: "NLP / AI" },
              ].map((badge) => (
                <HStack key={badge.label} gap={1.5}>
                  <Icon as={badge.icon} boxSize={3.5} color={T.textDim} />
                  <Text fontSize="xs" color={T.textDim} fontWeight="500">
                    {badge.label}
                  </Text>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* ── LAYER 2: CHUNKED GATEWAY (The Three Pillars) ── */}
      <Box
        as="section"
        role="region"
        aria-label="Core specializations"
        py={{ base: 12, md: 20 }}
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={T.breathing} align="stretch">
            <Text
              fontSize="xs"
              fontWeight="500"
              color={T.textDim}
              textTransform="uppercase"
              letterSpacing="0.1em"
            >
              Core Work
            </Text>

            <VStack gap={4} align="stretch">
              {PILLARS.map((pillar) => (
                <PillarCard key={pillar.title} pillar={pillar} />
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* ── Minimal divider ── */}
      <Box display="flex" justifyContent="center" aria-hidden="true">
        <Box w="40px" h="1px" bg={T.border} />
      </Box>

      {/* ── LAYER 3 ENTRY: Contact strip ── */}
      <Box
        as="section"
        role="region"
        aria-label="Contact"
        py={{ base: 16, md: 24 }}
      >
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <VStack gap={4} align="start">
            <Heading
              as="h2"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="600"
              color={T.text}
            >
              Let&apos;s work together
            </Heading>
            <Text fontSize="md" color={T.textMuted} lineHeight="1.7" maxW="420px">
              Open to collaboration on civic technology, public interest data systems,
              and institutional transparency projects.
            </Text>
            <HStack gap={4} mt={2}>
              <Link href="mailto:visarut298@gmail.com">
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color={T.accent}
                  _hover={{ textDecoration: "underline" }}
                  transition="all 0.15s"
                >
                  visarut298@gmail.com
                </Text>
              </Link>
              <Text fontSize="sm" color={T.textDim}>·</Text>
              <Link href="https://www.linkedin.com/in/visarut-sankham-99b008b9/" target="_blank" rel="noopener noreferrer">
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color={T.textMuted}
                  _hover={{ color: T.text }}
                  transition="color 0.15s"
                >
                  LinkedIn
                </Text>
              </Link>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* ── Footer ── */}
      <Box py={8} borderTop="1px solid" borderColor={T.border}>
        <Container maxW="3xl" mx="auto" px={{ base: 5, md: 6 }}>
          <Text fontSize="xs" color={T.textDim}>
            © {new Date().getFullYear()} Visarut Sankham — Signal 39 Prototype
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
