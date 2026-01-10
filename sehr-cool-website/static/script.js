document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. INITIALIZE MERMAID
    ========================= */
    mermaid.initialize({ 
        startOnLoad: true, 
        theme: 'dark',
        securityLevel: 'loose',
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' }
    });

    /* =========================
       2. ANIMATION OBSERVER
    ========================= */
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active");
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    /* =========================
       3. DISEASE DATABASE
    ========================= */
    const diseaseDatabase = {
        "Cystic Fibrosis": { inheritance: "Autosomal Recessive", features: ["CFTR gene mutation", "Thick mucus buildup"], symptoms: ["Lung infections", "Salty skin"] },
        "Sickle Cell Anemia": { inheritance: "Autosomal Recessive", features: ["Abnormal hemoglobin", "Sickle-shaped cells"], symptoms: ["Pain crises", "Anemia"] },
        "Huntington Disease": { inheritance: "Autosomal Dominant", features: ["Nerve cell breakdown", "Onset in 30s-40s"], symptoms: ["Involuntary movements", "Cognitive decline"] },
        "Marfan Syndrome": { inheritance: "Autosomal Dominant", features: ["FBN1 mutation", "Connective tissue disorder"], symptoms: ["Tall/thin build", "Heart issues"] },
        "Hemophilia": { inheritance: "X-Linked Recessive", features: ["Clotting factor deficiency", "Bleeding disorder"], symptoms: ["Excessive bleeding", "Joint pain"] },
        "Color Blindness": { inheritance: "X-Linked Recessive", features: ["Cone cell deficiency", "Red-Green difficulty"], symptoms: ["Color confusion"] },
        "Rett Syndrome": { inheritance: "X-Linked Dominant", features: ["MECP2 mutation", "Neurological disorder"], symptoms: ["Loss of speech", "Hand wringing"] },
        "Fragile X Syndrome": { inheritance: "X-Linked Dominant", features: ["FMR1 mutation", "Intellectual disability"], symptoms: ["Learning delays", "Social anxiety"] },
        "MELAS Syndrome": { inheritance: "Mitochondrial", features: ["Mitochondrial DNA defect", "Lactic acidosis"], symptoms: ["Stroke-like episodes", "Muscle weakness"] }
    };

    /* =========================
       4. UI INTERACTION LOGIC
    ========================= */
    const diseaseSelect = document.querySelector(".main-select");
    const overviewSection = document.getElementById("diseaseOverview");

    diseaseSelect.addEventListener("change", (e) => {
        const data = diseaseDatabase[e.target.value];
        if (data) {
            document.getElementById("diseaseTitle").textContent = e.target.value;
            document.getElementById("inheritanceTag").textContent = data.inheritance;
            document.getElementById("featuresList").innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
            document.getElementById("symptomsList").innerHTML = data.symptoms.map(s => `<li>${s}</li>`).join('');
            overviewSection.classList.remove("hidden-section");
            overviewSection.classList.add("active-overview");
            overviewSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Toggle carrier dropdown visibility
    document.addEventListener("change", (e) => {
        if (e.target.matches("select[data-status]")) {
            const card = e.target.closest(".person-card");
            const conditional = card.querySelector(".conditional");
            if (e.target.value === "Non-affected") {
                conditional.classList.remove("hidden");
            } else {
                conditional.classList.add("hidden");
            }
        }
    });

    /* =========================
       5. PEDIGREE RENDERER
    ========================= */
    function renderPedigree(grandparents, parents, userSex) {
        const getStyle = (p) => p.affected ? "fill:#ef4444,stroke:#fff,stroke-width:2px,color:#fff" : "fill:#334155,stroke:#fff,color:#fff";
        const getShape = (p, id, label) => p.sex === "M" ? `${id}[${label}]` : `${id}((${label}))`;

        let syntax = `graph TD\n`;
        syntax += `  ${getShape(grandparents[0], "PGF", "Pat GF")}\n`;
        syntax += `  ${getShape(grandparents[1], "PGM", "Pat GM")}\n`;
        syntax += `  ${getShape(grandparents[2], "MGF", "Mat GF")}\n`;
        syntax += `  ${getShape(grandparents[3], "MGM", "Mat GM")}\n`;
        syntax += `  ${getShape(parents[0], "FATH", "Father")}\n`;
        syntax += `  ${getShape(parents[1], "MOTH", "Mother")}\n`;
        syntax += `  ${userSex === "M" ? "USR[You]" : "USR((You))"}\n`;

        // Apply styles
        const allNodes = [
            {id: "PGF", p: grandparents[0]}, {id: "PGM", p: grandparents[1]},
            {id: "MGF", p: grandparents[2]}, {id: "MGM", p: grandparents[3]},
            {id: "FATH", p: parents[0]}, {id: "MOTH", p: parents[1]}
        ];
        allNodes.forEach(node => { syntax += `  style ${node.id} ${getStyle(node.p)}\n`; });

        // Build Relationships
        syntax += `  PGF --- PGM\n  MGF --- MGM\n`;
        syntax += `  PGF --- FATH\n  PGM --- FATH\n`;
        syntax += `  MGF --- MOTH\n  MGM --- MOTH\n`;
        syntax += `  FATH --- MOTH\n  FATH --- USR\n  MOTH --- USR\n`;

        const diag = document.getElementById("pedigreeDiagram");
        diag.removeAttribute("data-processed");
        diag.innerHTML = syntax;
        mermaid.run({ nodes: [diag] });
    }

    /* =========================
       6. RISK CALCULATION
    ========================= */
    document.getElementById("calculateBtn").addEventListener("click", () => {
        const getPerson = (id, sex) => {
            const card = document.getElementById(id);
            const status = card.querySelector("select[data-status]").value;
            const carrier = card.querySelector(".conditional select")?.value || "Unknown";
            return {
                sex: sex,
                affected: status === "Affected",
                carrier_status: status === "Affected" ? "known_carrier" : 
                                carrier === "Yes" ? "known_carrier" : 
                                carrier === "No" ? "known_non_carrier" : "unknown"
            };
        };

        const grandparents = [
            getPerson("card-pgf", "M"), getPerson("card-pgm", "F"),
            getPerson("card-mgf", "M"), getPerson("card-mgm", "F")
        ];
        const parents = [getPerson("card-father", "M"), getPerson("card-mother", "F")];
        const userSex = document.getElementById("userSex").value === "Male" ? "M" : "F";
        const disease = document.querySelector(".main-select").value;

        if (!disease || disease === "Select disease") return alert("Please select a disease.");

        renderPedigree(grandparents, parents, userSex);

        fetch("/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ disease, grandparents, parents, user_sex: userSex })
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById("riskText").innerHTML = `<strong>Probability Result: ${(data.risk * 100).toFixed(1)}%</strong><br>${data.explanation}`;
        })
        .catch(err => console.error("API Error:", err));
    });
});
