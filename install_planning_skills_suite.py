import os

GLOBAL_SKILLS_DIR = r"C:\Users\Shivam Manoj Nirmal\.gemini\config\skills"
LOCAL_SKILLS_DIR = r"C:\Users\Shivam Manoj Nirmal\Desktop\PPT OTHER TASKES\.agents\skills"
APP_SKILLS_DIR = r"C:\Users\Shivam Manoj Nirmal\Desktop\FoodLine App\.agents\skills"

SKILLS = {
    "project-planner": """---
name: project-planner
description: Master strategic project planning, milestone roadmapping, dependency mapping, and risk-adjusted delivery schedules. Use when scoping projects, breaking down initiatives, or establishing multi-phase roadmaps.
---

# 🗺️ Project Planner Skill

Master strategic project planning, phase decomposition, dependency graphs, and resource-balanced milestones.

## Core Capabilities
1. **Multi-Phase Roadmapping:** Phased breakdown (Phase 1 MVP ➔ Phase 2 Scale ➔ Phase 3 Domination).
2. **Critical Path Analysis:** Identify bottlenecks and single points of failure before execution.
3. **Milestone Definition:** Quantifiable, testable deliverables per sprint with zero ambiguity.
4. **Risk & Contingency Matrix:** Pre-mortems and mitigation protocols.

## Implementation Protocol
- Frame every plan around **Outcome Over Output**.
- Document assumptions, constraints, and explicit non-goals.
- Provide bottom-up time and capacity estimations.
""",

    "brainstorming": """---
name: brainstorming
description: Systematic ideation, divergent thinking, design space exploration, and hypothesis generation. Use when exploring new features, solving complex design bottlenecks, or uncovering creative solutions.
---

# 💡 Brainstorming Skill

Structured creative ideation, first-principles exploration, and rapid hypothesis generation.

## Frameworks Applied
1. **SCAMPER:** Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse.
2. **Crazy Eights & Concept Variations:** Generate 8 distinct approaches to a single bottleneck.
3. **The 10x Use Value Rule:** Wallace D. Wattles' principle of giving 10x more utility than cash cost.
4. **Pre-Mortem Analysis:** What would cause this initiative to fail, and how do we engineer against it today?
""",

    "product-manager-planner": """---
name: product-manager-planner
description: Product requirements formulation, PRD drafting, user story mapping, MoSCoW & RICE prioritization, and metric design. Use when defining product features or writing specifications.
---

# 📋 Product Manager Planner Skill

Master product requirements engineering, user empathy mapping, and data-driven prioritization.

## Core Workflows
1. **User Story Mapping:** Slice vertical user journeys from discovery to goal completion.
2. **RICE Scoring Framework:** Reach × Impact × Confidence / Effort.
3. **MoSCoW Prioritization:** Must-Have, Should-Have, Could-Have, Won't-Have.
4. **North Star Metric & KPI Trees:** Aligning features with core business outcomes.
""",

    "software-architecture-planner": """---
name: software-architecture-planner
description: System architecture planning, C4 modeling, API boundary definitions, database schema design, and Architecture Decision Records (ADRs). Use when designing technical foundations.
---

# 🏗️ Software Architecture Planner Skill

Master technical planning, distributed systems design, data consistency models, and fault-tolerant architectures.

## Core Deliverables
1. **C4 Context & Container Diagrams:** Clear visual boundary maps of services and datastores.
2. **Architecture Decision Records (ADRs):** Document Context, Decision, Consequences, and Alternatives.
3. **Idempotency & Resilience Modeling:** Zero-data-loss strategies under unstable client networks.
4. **Database Schema DDL & Indexes:** Normalized relational models + real-time event streaming.
""",

    "sprint-planner": """---
name: sprint-planner
description: Agile sprint scoping, task decomposition, acceptance criteria definition, and TDD execution sequencing. Use when converting plans into actionable developer tasks.
---

# ⚡ Sprint Planner Skill

Convert strategic plans into granular, bite-sized, verifiable implementation tickets.

## Rules of Execution
1. **Atomic Tasks:** No task should exceed 2-4 hours of implementation time.
2. **Explicit Verification Steps:** Every task must specify how it will be tested (unit, visual, E2E).
3. **Zero-Defect Checkpoints:** Code must pass linting, type-checking, and build validation before task completion.
"""
}

def install():
    for name, content in SKILLS.items():
        for base_dir in [GLOBAL_SKILLS_DIR, LOCAL_SKILLS_DIR, APP_SKILLS_DIR]:
            skill_dir = os.path.join(base_dir, name)
            os.makedirs(skill_dir, exist_ok=True)
            skill_file = os.path.join(skill_dir, "SKILL.md")
            with open(skill_file, "w", encoding="utf-8") as f:
                f.write(content.strip() + "\n")
            print(f"Installed: {skill_file}")

if __name__ == "__main__":
    install()
