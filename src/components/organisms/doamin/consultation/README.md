# Consultation Brain: Business Component Design Principles

To seamlessly bridge the gap between "Consultant-Client UX" and "Systematic Engineering Principles," we have evolved our design philosophy from "passive support tools" into an "intelligent framework for collaborative dialogue."

These principles transform technical engineering requirements into professional business axioms, ensuring the system functions as a dynamic "Consultation Governance" engine.

## 🔄 Business Components Design Principles

### 1. `BlindSpotNavigator.vue`: Global Navigator

* **Design Principle:** **Dimensional Completion**
* **Core Philosophy:** Rather than using interruptive warnings, we employ structural detection to provide suggestive prompts. When the dialogue network density is insufficient (e.g., lacking CONCEPT or RESOURCE dimensions), the component assists both parties in elevating from localized anxiety to a strategic, holistic perspective, preventing them from falling into "blind spot loops".

### 2. `LogicConflictAlert.vue`: The Consensus Validator

* **Design Principle:** **Calibration Guidance**
* **Core Philosophy:** When the system detects a conflict between the dialogue and established boundaries (Strategic Baseline), we avoid cold error alerts. Instead, we use high-contrast visual tokens (Amber/Rose) to intervene dynamically, guiding the user to calibrate and transforming potential logic flaws into moments for information synchronization.

### 3. `SidebarRegistrySection.vue`: The Stability Accordion Hub

* **Design Principle:** **Contextual Cross-Examination & Cross-Module Interoperability**
* **Business Purpose:** The primary objective of this sidebar frame is to serve as the **"Strategic Anchor"** during intense consultant-client synchronization sessions. By displaying the hierarchical progression of stability—from raw, volatile **Proposals**, through contextualized **Reflections**, down to finalized, binding **Consensus Baselines**—it ensures the consultant can ground the live conversation in verified historical facts. It allows the user to immediately validate new claims against existing parameters, preventing strategic drift and maintaining strict alignment with the client's commercial objectives.
* **The Three Pillar Streams:**
  * **Proposals:** Represents dynamic, ongoing strategic choices or initiatives currently being shaped within the session. They are volatile, requiring active review and verification.
  * **Reflections:** Serves as the crucial repository for qualitative observations, qualitative client hesitations, or consultant annotations captured mid-dialogue. It bridges the gap between raw conversation data and structured structural mappings.
  * **Consensus Baselines:** Represents the fully validated, historical baselines that are immutable and locked down. They act as the objective fiscal and operational boundaries for the entire consultation timeline.
* **Core Philosophy:** Replaced the legacy horizontal tab constraints with a vertically stacked accordion mechanism. By utilizing standardized `ConceptualNode` mappings across separate telemetry sections (Proposals, Reflections, Consensus), it eliminates horizontal layout overflows on narrow sidebars.
* **Architectural Context (External Registry Integration):** This module deliberately imports `SidebarRegistrySection.vue` from the external *Knowledge Registry* domain. This separation guarantees that while the Consultation Brain drives active session reasoning, it streams data into a layout engine shared with the global knowledge map, enforcing cross-domain UI consistency. It empowers consultants with a multi-open layout to simultaneously cross-examine proposals alongside reflection histories without breaking the cognitive rhythm.

---

## 💡 Summary: Advantages of the Componentized Architecture

By adopting these principles, the system transforms from "technical engineering" into "business logic":

* **Collaborative Empathy:** All components possess a design logic understood by both the consultant and the client, ensuring a synchronized cognitive rhythm.

* **Structural Readiness:** Each component is mapped to backend `NodeType` and `EdgeType` requirements, ensuring that dialogue is captured as high-quality, structured data.

* **Consultation Governance:** The system proactively governs the dialogue's trajectory through navigation, conflict pre-emption, and state management, ensuring every output maintains strategic integrity.